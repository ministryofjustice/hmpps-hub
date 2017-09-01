define([], function() {
    var ctor = function(source, property, switchValue) {
        var initValue = source[property];

        source[property] = switchValue;

        this.revert = function() {
            source[property] = initValue;
        }
    }

    return ctor;
})