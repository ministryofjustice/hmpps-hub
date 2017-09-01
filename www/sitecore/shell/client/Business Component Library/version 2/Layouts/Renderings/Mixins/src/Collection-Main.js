define("bclCollection", ["Collection/Data", "Collection/DisplayFieldName", "Collection/ValueFieldName", "Collection/Factory"], function (Data, DisplayFieldName, ValueFieldName, Factory) {

  /**
   * By default Collection ships with special attributes. But if you do not need the all of special attributes
   * the assemle method lets you create a custom Collection only containing the basics of data handling and an
   * optional amount of special attributes.
   * 
   * @example
   * var ValueFieldCollection = Collection.assemble({ ValueFieldName: true });
   * 
   * @param {assembleOptions} include - What parts to include besides the basics.
   * @memberOf Collection
   */
  function assemble(include) {
    /**
     * @typedef {Object} assembleOptions
     * @alias assembleOptions
     * @property {boolean} [DisplayFieldName] - Include DisplayFieldName related methods and properties.
     * @property {boolean} [ValueFieldName] - Include ValueFieldName related methods and properties.
     */
    include = include || {};

    /**
     * The mixin <b>Collection</b> is intended to be used whenever you have a Control that should render a list of
     * elements.<br> The collection is meant to be used as an extension of your component, meaning it will add
     * properties and methods to your component.
     * 
     * <p>A custom build can be done by using the static {@link Collection.assemble} method, to exclude some of the featues.</p>
     * 
     * @example <caption>Loading and extending a component with Collection</caption>
     * (function (Speak) {
     *   var collectionPath = "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection.js";
     *
     *   Speak.component([collectionPath], function (Collection) {
     *     
     *     return Speak.extend({}, Collection.prototype, {
     *       initialized: function () {
     *         Collection.prototype.initialized.call(this); // call super
     * 
     *         this.on("itemsChanged", this.render, this);
     *       },
     * 
     *       render: function () {
     *         $(this.el).empty();
     *         this.Items.forEach(function (item) {
     *            $(this.el).append("<li>" + this.getDisplayName(item) + "</li>");
     *         }, this);
     *       }
     *     };
     * 
     *   }, "ListComponent");
     * 
     * })(Sitecore.Speak);
     * 
     * @constructor
     * @mixin Collection
     */
    var Custom = function () { };
    Custom.prototype.constructor = Custom;

    var dfn = include.DisplayFieldName ? DisplayFieldName : {},
      vfn = include.ValueFieldName ? ValueFieldName : {};

    Custom.prototype = Sitecore.Speak.extend({}, Data, dfn, vfn, { Model: Factory.createBaseModel() });
    return Custom;
  }

  var Collection = assemble({ ValueFieldName: true, DisplayFieldName: true });
  Collection.assemble = assemble;

  Collection.factory = Factory;

  return Collection;
});