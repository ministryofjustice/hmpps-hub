(function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++) s(r[o]); return s })({
  1: [function (require, module, exports) {
    module.exports = {
      addComponentAngleBracker: function (type) {
        return '<' + type + ' data-sc-id="<%=id%>" data-sc-presenter="<%=presenter%>" data-sc-component="<%=type%>" class="<%=className%>" data-sc-properties=\'<%=properties%>\' data-sc-require="<%=require%>" <%=attributes%>>';
      },
      addAngleBracker: function (type) {
        return '<' + type + ' class="<%=className%>" <%=attributes%> >';
      },
      addClosingAngleBracker: function (type) {
        return '</' + type + '>';
      }
    };

  }, {}], 2: [function (require, module, exports) {
    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed
    /* jshint ignore:start */
    var cache = {};

    var tmpl = function tmpl(str, data) {
      // Figure out if we're getting a template, or if we need to
      // load the template - and be sure to cache the result.
      var fn = !/\W/.test(str);

      if (fn) {
        cache[str] = cache[str] || tmpl(str);
      } else {
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        fn = new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str.replace(/[\r\t\n]/g, " ")
            .replace(/'(?=[^%]*%>)/g, "\t")
            .split("'").join("\\'")
            .split("\t").join("'")
            .replace(/<%=(.+?)%>/g, "',$1,'")
            .split("<%").join("');")
            .split("%>").join("p.push('") + "');}return p.join('');");
      }


      // Provide some basic currying to the user
      return data ? fn(data) : fn;
    };

    module.exports = tmpl;
    /* jshint ignore:end */

  }, {}], 3: [function (require, module, exports) {
    var microTemplate = require('../microTemplate');
    var DOMHelper = require('../helper');

    var ComponentHtml = function (componentMeta, properties, elements) {
      this.componentMeta = componentMeta;

      if (!this.componentMeta.attributes) {
        this.componentMeta.attributes = '';
      }

      if (!this.componentMeta.require) {
        this.componentMeta.require = '';
      }

      this.properties = properties || {};
      this.elements = elements || [];
    };

    ComponentHtml.prototype.render = function () {
      var result = [];

      this.componentMeta.properties = JSON.stringify(this.properties);

      result.push(microTemplate(DOMHelper.addComponentAngleBracker(this.componentMeta.element), this.componentMeta));

      if (this.elements) {
        this.elements.forEach(function (c) {
          result.push(c.render());
        });
      }

      result.push(DOMHelper.addClosingAngleBracker(this.componentMeta.element));

      return result.join('');
    };

    module.exports = ComponentHtml;

  }, { "../helper": 1, "../microTemplate": 2 }], 4: [function (require, module, exports) {
    var microTemplate = require('../microTemplate');
    var DOMHelper = require('../helper');

    var stringify = function (attributes) {
      var result = [];

      for (var i in attributes) {
        if (attributes.hasOwnProperty(i)) {
          result.push(i);
          result.push('="');
          result.push(attributes[i]);
          result.push('"');
        }
      }

      return result.join('');
    };

    var BasicHtml = function (type, className, attributes, elements) {
      this.type = type;
      this.className = className || '';
      this.attributes = stringify(attributes);
      this.elements = elements;
    };

    BasicHtml.prototype.render = function () {
      var result = [];

      result.push(microTemplate(DOMHelper.addAngleBracker(this.type), {
        className: this.className,
        attributes: this.attributes
      }));

      if (this.elements) {
        if (typeof this.elements === 'string') {
          result.push(this.elements);
        } else {
          this.elements.forEach(function (c) {
            result.push(c.render());
          });
        }
      }

      result.push(DOMHelper.addClosingAngleBracker(this.type));

      return result.join('');
    };

    module.exports = BasicHtml;

  }, { "../helper": 1, "../microTemplate": 2 }], 5: [function (require, module, exports) {
    module.exports = {
      button: {
        type: 'Button',
        element: 'button',
        className: 'btn sc-button btn-primary',
        presenter: 'scKoPresenter',
        attributes: 'data-bind="text: Text"',
        //require: '../component/button.js',
      },
      border: {
        type: 'Border',
        element: 'div',
        className: 'sc-border',
        presenter: 'scKoPresenter',
        attributes: 'data-bind="visible: IsVisible"'
      },
      text: {
        type: 'Text',
        element: 'span',
        className: 'sc-text',
        presenter: 'scKoPresenter',
        attributes: 'data-bind="text: Text"'
      }
    };

  }, {}], 6: [function (require, module, exports) {
    var BasicElement = require('./DOM/model/basicElement');

    var basicFactory = {
      createElement: function (element, className, attributes, elements) {
        return new BasicElement(element, className, attributes, elements);
      }
    };

    module.exports = basicFactory;

  }, { "./DOM/model/basicElement": 4 }], 7: [function (require, module, exports) {
    var isObject = function (obj) {
      var type = typeof obj;
      return type === 'function' || type === 'object' && !!obj;
    };

    var extend = function (obj) {
      if (!isObject(obj)) {
        return obj;
      }

      var source, prop;
      for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
          if (Object.prototype.hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
          }
        }
      }
      return obj;
    };

    module.exports = {
      extend: extend
    };

  }, {}], 8: [function (require, module, exports) {
    (function (global) {
      var isBrowser = typeof window !== 'undefined',
          root = isBrowser ? window : global,
          helper = require('./helper');

      var insert = function (name, component, callback, type) {
        var _speak = root.Sitecore.Speak;
        var app = name ? _speak.app.findApplication(name) : _speak.app;

        if (type === 'prepend') {
          app.prepend(component.render(), callback);
        } else {
          app.append(component.render(), callback);
        }
      };

      var insertInDom = function (cssClassName, component, callback) {
        var _speak = root.Sitecore.Speak;
        var app = _speak.app;

        app.append({
          html: component.render(),
          el: cssClassName
        }, callback);
      };

      var insertInComponent = function (name, component, done, type) {
        var _speak = root.Sitecore.Speak;
        var appName = name,
            componentToRender = component;

        var comp = _speak.app.findComponent(appName);

        if (!comp) {
          throw 'component not found';
        }

        if (type === 'prepend') {
          comp.app.prepend({
            html: component.render(),
            el: comp.el
          }, done);
        } else {
          comp.app.append({
            html: component.render(),
            el: comp.el
          }, done);
        }
      };

      var allReadyFns = [];
      var API = {
        injectTemplate: function (template, options, callback) {
          var _speak = root.Sitecore.Speak;
          _speak.template.get(template, function (template) {
            _speak.insertMarkups(template, options, callback);
          });
        },
        inject: function (cssClassName, component, callback) {
          insertInDom(cssClassName, component, callback, 'append');
        },
        appendToApplication: function (name, component, callback) {
          var appName = name,
              comp = component,
              done = callback;

          if (arguments.length === 2) {
            appName = '';
            comp = name;
            done = component;
          }

          insert(appName, comp, done, 'append');
        },
        prependToApplication: function (name, component, callback) {
          var appName = name,
              comp = component,
              done = callback;

          if (arguments.length === 2) {
            appName = '';
            comp = name;
            done = component;
          }

          insert(appName, comp, done, 'prepend');
        },
        appendToComponent: function (name, component, callback) {
          insertInComponent(name, component, callback, 'append');
        },
        prependToComponent: function (name, component, callback) {
          insertInComponent(name, component, callback, 'prepend');
        },
        ready: function (fn) {
          allReadyFns.push(fn);
        },
        init: function () {
          allReadyFns.forEach(function (fn) {
            fn();
          });
        }
      };

      helper.extend(API, require('./basic'));
      helper.extend(API, require('./speak'));

      module.exports = API;

      if (isBrowser) {
        window.Sitecore = window.Sitecore || {};
        window.Sitecore.Extension = module.exports;
      }

    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, { "./basic": 6, "./helper": 7, "./speak": 9 }], 9: [function (require, module, exports) {
    var ComponentHtml = require('./DOM/model/basicComponent');
    var speakDefinition = require('./SPEAK/index');
    var helper = require('./helper');
    var basic = require('./basic');

    var component = function (type, id, properties, elements) {
      var definition = helper.extend(speakDefinition[type], {
        id: id
      });

      return new ComponentHtml(definition, properties, elements);
    };

    var factory = {
      button: function (id, properties, elements) {
        var buttonElements = [
            basic.createElement('span', 'sc-button-text', {
              'data-bind': 'text:Text'
            })
        ];

        if (elements) {
          buttonElements = buttonElements.concat(elements);
        }

        return component('button', id, properties, buttonElements);
      },
      border: function (id, properties, elements) {
        return component('border', id, properties, elements);
      },
      text: function (id, properties, elements) {
        return component('text', id, properties, elements);
      }
    };

    module.exports = factory;

  }, { "./DOM/model/basicComponent": 3, "./SPEAK/index": 5, "./basic": 6, "./helper": 7 }]
}, {}, [8]);
