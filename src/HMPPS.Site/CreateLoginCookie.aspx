<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="HMPPS.Authentication.Pipelines" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Session abandon</title>
</head>
<body>
<%
    var authLoginRedirector = new HMPPS.Authentication.Pipelines.LoginRedirector();
    authLoginRedirector.LogInHardcodedIdamUser(HttpContext.Current);
%>

<p>User auth cookie has been created.</p>
</body>
</html>
