<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="health-check.aspx.cs" Inherits="HMPPS.Site.health_check" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Health Check</title>

    <%--<script type="test/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.11/handlebars.amd.min.js"></script>
        <script type="test/javascript" src="hmppsAssets/js/src/third-party/lib/jquery-3.2.1.min.js"></script>--%>

        <style>
            body {
                  font-family: "Open Sans", sans-serif;
                  line-height: 1.25;
            }
            h2 {
                text-align:center;
            }
            div.wrapper {
                margin: 0 auto;
                display: table;
                table-layout: fixed;
                width:95%;
            }
            div.wrapper div {
                display: table-cell;
                height:100px;
                left:5px;
                right:5px;
            }
            table {
                border: 1px solid #ccc;
                border-collapse: collapse;
                margin: 0;
                padding: 0;
                width: 100%;
                table-layout: fixed;
            }
            table tr {
                background: #f8f8f8;
                border: 1px solid #ddd;
                padding: .35em;
            }
            table th,
            table td {
                padding: .625em;
                text-align: center;
            }
            table th {
                font-size: .85em;
                letter-spacing: .1em;
                text-transform: uppercase;
            }
            table td.error {
                background-color:crimson;
            }
        </style>
    </head>

    <body>
        <div id="results" class="wrapper">
        
        </div>

        <script>
            var healthChecks = [
                {
                    name: "CMS",
                    url: "https://hmpps-cms.localhost/web-api/health"
                },
                {
                    name: "Content Delivery",
                    url: "https://hmpps-cd.localhost/web-api/health"
                },
                {
                    name: "Analytics Processing",
                    url: "https://hmpps-cms.localhost/web-api/health"
                },
                {
                    name: "Analytics Reporting",
                    url: "https://hmpps-cms.localhost/web-api/health"
                }
            ];

            function runHealthChecks() {
                for (var i = 0; i < healthChecks.length; i++) {
                    runHealthCheck(healthChecks[i].name, healthChecks[i].url);
                }
            }

            function runHealthCheck(name, url) {
                var request = new XMLHttpRequest();
                request.open('GET', url, true);

                request.onload = function () {
                    var data = JSON.parse(request.responseText);

                    generateTable(data, name);
                };
                request.onerror = function () {

                };

                request.send();
            }

            function generateTable(data, name) {
                var column = document.createElement("div");
                var table = document.createElement("table");
                var tableBody = document.createElement("tbody");
                
                var tableHead = document.createElement("thead");
                var headRow = document.createElement("tr");

                headRow.innerHTML = "<th>Facet</th><th>Status</th>"
                tableHead.appendChild(headRow);
                table.appendChild(tableHead);

                for (var i = 0; i < data.length; i++) {
                    var row = document.createElement("tr");

                    var nameCell = document.createElement("td");
                    var healthyCell = document.createElement("td");

                    nameCell.innerHTML = data[i].Name;
                    healthyCell.innerHTML = data[i].Healthy ? "Healthy" : "ERROR";

                    if (!data[i].Healthy) {
                        healthyCell.classList.add("error");
                    }

                    row.appendChild(nameCell);
                    row.appendChild(healthyCell);

                    tableBody.appendChild(row);
                }

                var heading = document.createElement("h2");
                heading.innerHTML = name;

                table.appendChild(tableBody);
                column.appendChild(heading);
                column.appendChild(table);
         
                var resultsWrapper = document.getElementById("results");
                resultsWrapper.appendChild(column);
            }

            function refreshData() {
                var resultsWrapper = document.getElementById("results");
                resultsWrapper.innerHTML = "";

                runHealthChecks();
            }

            window.setInterval(function () {
                refreshData();
            }, 30000);

            refreshData();
        </script>
    </body>

</html>
