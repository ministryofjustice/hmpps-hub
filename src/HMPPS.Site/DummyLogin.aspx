<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="HMPPS.Authentication.Pipelines" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Dummy User Login</title>
</head>
<body>
<%
    var dummyLoginEnabled = (Request.Url.Authority.Contains("localhost") || Request.Url.Authority.Contains("devtest"));
    if (dummyLoginEnabled){
        var authLoginRedirector = new HMPPS.Authentication.Pipelines.LoginRedirector();
        authLoginRedirector.LogInHardcodedIdamUser(HttpContext.Current);
    }

%>
<h1>Dummy User Login</h1>
    <%if (dummyLoginEnabled){ %>
<p>Dummy user logged in. Log out <a href="/dummylogout.aspx">here</a> or go back to the homepage <a href="/">here</a>.</p>
    <%} %>
</body>
</html>
