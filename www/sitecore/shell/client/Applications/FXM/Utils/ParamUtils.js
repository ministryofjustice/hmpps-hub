define(["sitecore"], function (_sc) {
    'use strict';
    var qsRepo = {
            read: function (name) { return _sc.Helpers.url.getQueryParameters(window.location.href)[name]; },
            write: function (name, val) { 
                var v = {};
                v[name] = val;
                _sc.Helpers.url.addQueryParameters(window.location.href, v);
            }
        },
        hashRepo = {
            read: function(name) {
                var hash = window.location.hash.substring(1),
                    params = _sc.Helpers.url.getQueryParameters(hash);
                return params[name];
            },
            write: function(name, val) {
                var hash = window.location.hash.substring(1),
                    params = _sc.Helpers.url.getQueryParameters(hash);

                params[name] = val;
                window.location.hash = _sc.Helpers.url.addQueryParameters(window.location.hash, params);
            }
        },
        objRepo = {
            read: function (obj, name) { return obj[name]; },
            write: function (obj, name, val) { obj[name] = val; }
        };
        
    function normalise (value) {
        if (!value) {
            return value;
        }

        var fixed = _sc.Helpers.id.toId(value);
        if (fixed[0] !== '{' && fixed[fixed.length - 1] !== '}') {
            fixed = '{' + fixed + '}';
        }

        return fixed;
    }

    function validate(value) {
        var fixed = normalise(value);
        return { valid: _sc.Helpers.id.isId(fixed), id: fixed };
    }
    
    function parseTargets (targets) {
        var repos = [];
        
        // loop so that we honour the precedence order of the targets
        for (var targetType in targets) {
            if (targets.hasOwnProperty(targetType) &&
                typeof targets[targetType] !== 'undefined' &&
                targets[targetType] !== null) {
                if (targetType === 'qs' && targets[targetType]) {
                    repos.push(qsRepo);
                    continue;
                }

                if (targetType === 'hash' && targets[targetType]) {
                    repos.push(hashRepo);
                    continue;
                }

                if (targets[targetType].constructor === Object) {
                    targets[targetType] = [targets[targetType]];
                }

                if (Array.isArray(targets[targetType])) {
                    $.each(targets[targetType], function(i, obj) {
                        repos.push({
                            read: function(name) {
                                return objRepo.read(obj, name);
                            },
                            write: function(name, val) {
                                objRepo.write(obj, name, val);
                            }
                        });
                    });
                    continue;
                }
            }
        }
        
        return repos;
    }

    function getParamFromTargets(paramNames, targets) {
        var val, repos = parseTargets(targets);
        
        _.find(paramNames, function(paramName) {
            _.find(repos, function (repo) {
                return typeof (val = repo.read(paramName)) !== 'undefined';
            });
            return typeof val !== 'undefined';
        });

        return val;
    }
        
    function setParamsOnTargets(params, targets) {
        var repos = parseTargets(targets);

        for (var paramName in params) {
            if (params.hasOwnProperty(paramName) && params[paramName] !== null) {
                $.each(repos, function(i, repo) {
                    repo.write(paramName, params[paramName]);
                });
            }
        }
    }

    return {
        /* 
        * Gets a parameter on the targets specified. The targets are searched in the order specified
        * until a value is found.
        * @param {Array} paramNames - An array of parameter names, which are searched in order until a value is found.
        * @param {Object} targets - An object specifying the types of targets on which to search for the param; querystring, url fragment, one or more supplied objects.
        *      { qs: true|false, hash: true|false}, objs: <value> | [ <val1>, <val2>, ... ]
        */
        getParamFromTargets: getParamFromTargets,

        /**
         * Gets a validated item id from context and falls back to query string if specified.
         * @param   {Object} context An object in which to search for an id.
         * @param   {Boolean} checkQueryString Look in the query string for the id.
         * @returns {Object} Id object with a valid flag set.
         */
        getIdFromContext: function(context, checkQueryString) {
            var targets = {
                objs: context,
                qs: checkQueryString,
                hash: true
            };
            return validate(getParamFromTargets(['id', 'itemId', 'Id', 'ItemId', 'sc_itemId'], targets));
        },

        /*
        * Gets a validated parent item id from context and falls back to query string if specified.
        * @param {Object} context - An object in which to search for an id.
        * @param {Boolean} checkQueryString - look in the query string for the id.
        */
        getParentIdFromContext: function(context, checkQueryString) {
            var targets = {
                objs: context,
                qs: checkQueryString,
                hash: true
            };
            return validate(getParamFromTargets(['parent', 'parentId', 'Parent', 'ParentId', 'pId'], targets));
        },

        /* 
        * Sets one or more parameters on the targets specified.
        * @param {Object} params - An object specifying the key and values of params to save, { param1: <val1>, param2: <val2, .... }
        * @param {Object} targets - An object specifying the types of targets on which to search for the param; querystring, url fragment, one or more supplied objects.
        *      { qs: true|false, hash: true|false}, objs: <value> | [ <val1>, <val2>, ... ]
        */
        setParamsOnTargets: setParamsOnTargets,

        validate: function(value) {
            return validate(value);
        }
    };
});