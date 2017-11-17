<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="HMPPS.Authentication.Pipelines" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Dummy User Logout</title>
</head>
<body>
<%
    var dummyLogoutEnabled = (Request.Url.Authority.Contains("localhost") || Request.Url.Authority.Contains("devtest"));
    if (dummyLogoutEnabled){
        Sitecore.Security.Authentication.AuthenticationManager.Logout();
         var userDataCookie = new HMPPS.Utilities.Helpers.CookieHelper(System.Configuration.ConfigurationManager.AppSettings["UserDataCookieName"], HttpContext.Current);
           userDataCookie.Delete();
    }

%>
<h1>Dummy User Logout</h1>
    <%if (dummyLogoutEnabled){ %>
<p>Dummy user logged out. Log in again on <a href="/dummylogin.aspx">here</a> or go back to the homepage <a href="/">here</a>.</p>
    <%} %>
</body>
</html>
