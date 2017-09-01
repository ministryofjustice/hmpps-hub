/**
* Syntax:
* Class.extend(props)
* Class.extend(props, staticProps)
* Class.extend([mixins], props)
* Class.extend([mixins], props, staticProps)
*/
!function () {

    window.Class = function () {
    };


    Class.extend = function (props, staticProps) {

        // if first arg is array, then let's add mixins
        if ({}.toString.apply(arguments[0]) == "[object Array]") {
            var mixins = arguments[0];
            props = arguments[1];
            staticProps = arguments[2];
            for (var i = 0; i < mixins.length; i++) {
                for (var key in mixins[i]) { // IE has bugs with copying of toString/valueOf. Mixins shouldn't have them anyway
                    props[key] = mixins[i][key];
                }
            }
        }


        function Constructor() {
            this.init && this.init.apply(this, arguments);
        }

        copyWrappedProps(this, Constructor, staticProps || {});

        Constructor.prototype = inherit(this.prototype);
        Constructor.prototype.constructor = Constructor;
        Constructor.extend = Class.extend;

        copyWrappedProps(this.prototype, Constructor.prototype, props);


        return Constructor;

    };


    //---------- helpers

    function copyWrappedProps(currentPropsObj, newPropsObj, props) {

        for (var name in props) {
            if (typeof props[name] == "function"
        && typeof currentPropsObj[name] == "function"
        && fnTest.test(props[name])) {
                newPropsObj[name] = wrap(props[name], currentPropsObj[name]);
            } else {
                newPropsObj[name] = props[name];
            }
        }

    }


    var fnTest = /xyz/.test(function () {
        xyz;
    }) ? /\b_super\b/ : /./;

    function wrap(method, parentMethod) {
        return function () {
            var backup = this._super;

            this._super = parentMethod;

            try {
                return method.apply(this, arguments);
            } finally {
                this._super = backup;
            }
        }
    }


    var inherit = Object.create || function (proto) {
        function F() { }
        F.prototype = proto;
        return new F;
    };
} ();