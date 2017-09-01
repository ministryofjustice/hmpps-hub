<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Jobs.aspx.cs" Inherits="Sitecore.ExperienceContentManagement.Administration.Jobs" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title>Jobs Viewer</title>
        <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
        <link rel="Stylesheet" type="text/css" href="./default.css" />
        <style type="text/css">
            .jobs-table {
                border: solid 1px grey;   
                border-spacing: 2px;
                border-collapse: separate;
                width: 100%;
            }

            .jobs-table td {
                padding: 2px;
            }

            .jobs-table thead {
                font-weight: bold;
            }
            
            .jobs-table .counter {
                width: 25px;
                text-align: right;
            }      
                     
            .jobs-table .add-time {
                width: 150px;
            }     
                       
            .jobs-table .title {
                word-break: break-all;
            }    
                        
            .jobs-table .progress {
                width: 50px;
                text-align: center;
            }   
                                          
            .jobs-table .priority {
                width: 80px;
            }                 
        </style>
    </head>
    <body>
        <form id="Form1" runat="server" class="wf-container">
            <div class="wf-content">
                <h1>
                    <a href="/sitecore/admin/">Administration Tools</a> - Jobs Viewer
                </h1>
                <br />
                <asp:Literal runat="server" ID="lt"></asp:Literal>
                <script type="text/javascript">
                    function getQueryString() {
                        var result = {}, queryString = location.search.substring(1), re = /([^&=]+)=([^&]*)/g, m;
                        while (m = re.exec(queryString)) {
                            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                        }

                        return result;
                    }

                    var str = getQueryString()["refresh"];
                    if (str != undefined) {
                        c = parseInt(str) * 1000;
                        setTimeout("document.location.href = document.location.href;", c);
                    }
                </script>
            </div>
        </form>
    </body>
</html>