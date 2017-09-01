define(["sitecore"], function (_sc) {
    _sc.Commands.OpenDomainDashboard =
    {
        domainDashboardUrl: "/sitecore/client/Applications/FXM/DomainDashboard",

        canExecute: function (context) {
            return true; 
        },
        execute: function (context) {
            window.location = this.domainDashboardUrl;
        }
    };
});