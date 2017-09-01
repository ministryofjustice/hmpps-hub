(function(root, speak) {
    var lifeCycle = ["initialized", "beforeRender", "render", "afterRender"];

    var LifeCycleExecutor = function(comp) {
        this.comp = comp;
        this.life = lifeCycle.slice(0);
        this.isFullyInitialized = false;
    };

    LifeCycleExecutor.prototype.next = function() {
        var method = this.life.shift();
        if (!method) {
            throw "No more method to call";
        }
        this.comp[method]();

        return method;
    };

    LifeCycleExecutor.prototype.all = function() {
        while (this.life.length) {
            var method = this.life.shift();
            if (this.comp[method]) {
                this.comp[method]();
            }
        }
    };


    /**
     * {type}: type of the component "Button, Label,..."
     * {el}: DOMElement
     * {presenter}: Name of the presenter you want to use (if not defined in component)
     * {template}: Template used to define what the component should look like in SPEAK
     * {app}: Application where you want to expose the component
     */
    var speakMock = function(type, el, presenter, template, app) {

        var compDef = speak.component(type);

        var component = speak.exposeComponent({
            key: type,
            el: el,
            presenter: presenter || "scComponentPresenter",
            app: app || {}
        });

        var state = "instanciated";

        var lifeCycle = new LifeCycleExecutor(component);

        return {
            state: state,
            component: component,
            next: function() {
                state = lifeCycle.next();

                return this;
            },
            run: function() {
                lifeCycle.all();
                state = "completed";
                return this;
            }
        };
    };

    return root.speakMock = speakMock;
}(window, Sitecore.Speak));
