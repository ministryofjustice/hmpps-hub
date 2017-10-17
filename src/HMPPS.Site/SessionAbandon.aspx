<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="Sitecore.Security.Authentication" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Session abandon</title>
</head>
<body>
<%
    AuthenticationManager.Logout();
    if (HttpContext.Current.Response.Cookies["ASP.NET_SessionId"] != null)
    {
        HttpContext.Current.Session.Abandon();
        Sitecore.Analytics.Tracker.Current.EndTracking();
        var myCookie = new HttpCookie(FormsAuthentication.FormsCookieName);
        myCookie.Expires = DateTime.Now.AddDays(-1d);
        HttpContext.Current.Response.Cookies.Add(myCookie);
    }

%>

<p>Session has been abandoned.</p>
</body>
</html>
