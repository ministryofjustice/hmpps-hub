/**
* The mixin <b>Utils</b> is used for various shared methods across components in the BCL2 project.
* 
* @example <caption>How to included Utils mixin into component JavaScript</caption>
* (function (Speak) {
*   var utilsPath = "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Utils";
*
*   Speak.component([utilsPath], function (Utils) {
*     return {
*       initialized: function () {
*         var allElements = Utils.dom.nodeListToArray(document.querySelectorAll("*"));
*       }
*     };
* 
*   }, "Component");
* 
* })(Sitecore.Speak);
* 
* @constructor
* @mixin Utils
*/
define("bclUtils", ["Utils/DOM"], function (dom) {
  var Utils = {
    /**
    * For easier usage of native JavaScript NodeLists and Elements
    */
    dom: dom
  };

  return Utils;
});