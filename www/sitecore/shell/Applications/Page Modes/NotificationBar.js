if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

/**
* @class represents single notification message
*/
Sitecore.PageModes.Notification = Base.extend({
   /**
  * @constructor Creates an instance of a class 
  */
  constructor: function(id, text, options) {
    if (!options) {
      options = {};
    }

    this.id = id.toLowerCase();
    this.text = text;
    this.actionText = options.actionText;
    this.onActionClick = options.onActionClick || $sc.noop();
    this.type = options.type || "warning";
    switch(this.type) {
      case "warning":
        this.notificationTypeCssClass = "scWarning";
        break;
      case "error":
        this.notificationTypeCssClass = "scError";
        break;
      case "info":
        this.notificationTypeCssClass = "scInfo";
        break;
      default:
        this.notificationTypeCssClass = "scWarning";
    }
  }
},
{
  template: [      
      " <div data-notification-id='${id}' class='scNotification  ${notificationTypeCssClass}'>",
      "    <img class='scClose' src='/sitecore/shell/Themes/Standard/Images/Progress/globalsearch_close.png'/>",
      "    <span class='scDescription'>${text}</span>",
      "    {{if actionText}}",
      "    <a class='scAction' href='#'>${actionText}</a>",
      "    {{/if}}",
      " </div>",   
    ].join("\n")
}
);

/**
* @class represents the notification bar
*/
Sitecore.PageModes.NotificationBar = Base.extend({
  /**
  * @constructor Creates an instance of a class 
  */
  constructor: function() {   
    this.position = null;
    this.notifications = [];    
  },

  /**
  * @description Adds new notification unless it is not already in the list
  * @param {Notification} The notification. @see Sitecore.PageModes.Notification
  */
  addNotification: function(notification) {
    var notificationId = notification.id;
    if ($sc.exists(this.notifications, function() { return this.id == notificationId; })) {
      return;
    }

    this.notifications.push(notification);
  },

  /**
  * @description Gets the notification message by id
  * @param {String} id The notification id.
  * @return {Notification} The notification. @see Sitecore.PageModes.Notification
  */
  getNotification:  function(id) {
    return $sc.first(this.notifications, function() { return this.id == id});
  },

  /**
  * @description Removes the specified notification from the list
  * @param {String} id The notification id.
  * @return {Notification} The notification. @see Sitecore.PageModes.Notification
  */
  removeNotification: function(id) {
    var idx = $sc.findIndex(this.notifications, function() { return this.id == id; });
    if (idx < 0) {
      return;
    }

    this.notifications.splice(idx, 1);
  },

  /**
  * @description Create DOM nodes
  */
  create: function() {    
    this.bar = $sc("<div></div>").addClass("scNotificationBar").hide().appendTo(document.body);
    this.bar.click($sc.proxy(this.clickHandler, this));
  },

   /**
  * @description Handles click on notification bar
  * @param {Event} e The event.
  */
  clickHandler: function(e) {
    var sender = $sc(e.target), notification, n;
    if (sender.hasClass("scClose")) {
      notification = sender.closest(".scNotification");
      if (!notification.length) {
        return;
      }

      notification.hide();
      this.removeNotification(notification.attr("data-notification-id").toLowerCase());
      return;
    }

    if (sender.hasClass("scAction")) {
      notification = sender.closest(".scNotification");
      if (!notification.length) {
        return;
      }

      notification = this.getNotification(notification.attr("data-notification-id").toLowerCase());
      if (notification && notification.onActionClick) {
        notification.onActionClick();
      }
    }
  },

  /**
  * @description Defines if position is specifed for the bar
  * @returns {Boolean} Value indication if position is specified
  */
  hasPosition: function() {
    return this.position != null;
  },

  /**
  * @description Hides the bar 
  */
  hide: function() {
    if (this.bar) {
      this.bar.hide();
    }
  },

  /**
  * @description Renders the notification
  */
  render:function() {
    if (!this.bar) {
      this.create();
    }
   
    var template = Sitecore.PageModes.Notification.template;
    this.bar.html("").append($sc.util().renderTemplate("sc-notificationBar", template, this.notifications));
  },

  /**
  * @description Resets the bar 
  */
  resetPosition: function() {
    this.position = null;
  },

  /**
  * @description Sets the position 
  */
  setPosition: function(pos) {
    this.position = pos;
  },

  /**
  * @description Shows the bar 
  */
  show: function() {  
    this.render();
    if (this.hasPosition()) {    
      this.bar.css({top: this.position.top + "px", left: this.position.left + "px"});          
    }
        
    this.bar.show();
  },

  /**
  * @description Defines if bar is visisble
  * @retruns {Boolean} Value indicating if bar is visible 
  */
  visible: function() {
    return this.bar && this.bar.is(":visible");
  }
});
