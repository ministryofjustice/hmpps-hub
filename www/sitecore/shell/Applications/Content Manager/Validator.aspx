<%@ Page Language="C#" AutoEventWireup="true" Inherits="Sitecore.Shell.Applications.ContentManager.Validator" %>
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<style>
  body {
        font-size:12px !important;
        line-height:18px !important;
  }

  a {
    color:#2694C0 !important;
  }

  table {
    text-align:left;
  }

  body > * {
    width:800px;
    margin:0 auto !important;
  }

  form {
    height:auto !important;
  }

  h1 {
  font-size:18px !important;
  }

  body > h1 {
    margin-top:25px !important;
  }

  h2.valid {
    clear:both;
    font-size:24px;
    margin:15px 0;
  }

  #markup {
    border:1px solid #ccc !important;
    background-color:#f7f7f7;
    margin:0 auto 15px !important;
  }
  
  h1#title a:first-of-type {
display: block;
width: 125px;
float: left;
}

  #jumpbar.navbar,
  #menu.navbar {
    clear:both;
    margin:15px 0 25px;
  }
  #jumpbar.navbar li,
  #menu.navbar li {
    display:inline-block;
    margin-right:10px;
  }

  table.header select {
    margin:10px 0;
  }

  #results_container {
  margin-top: 40px !important;
  }

  #result {
    margin:15px 0;
  }

    #result li {
      clear:both;
      margin:15px 0;
    } 

    #result li p span:first-of-type {
      display:block;
      width:48px;
      float:left;
    } 
  
     #result h3 {
      font-size:14px !important;
      font-weight:600;
    }

.w3c-include > p:first-of-type {
padding-right: 2em !important;
padding-left: 0em !important;
}
    .w3c-include > p {
      text-align:left !important;
    }



input[type="submit"] {
border-color: #207da2  !important;
-webkit-box-shadow: inset 0 1px #5dbadf !important;
box-shadow: inset 0 1px #5dbadf !important;
color: #fff !important;
background-color: #207da2 !important;
background-image: linear-gradient(to bottom, #289bc8 0%, #207da2 100%) !important;

margin-left:0 !important;
}

input[type="submit"]:hover {
background-repeat: repeat-x !important;
border-color: #207da2 !important;
background-color: #289bc8 !important;
background-image: linear-gradient(to bottom, #289bc8 0%, #289bc8 100%) !important;
}

#OK:active, .scButtonPrimary:active {
background-color: #207da2 !important;
background-image: -webkit-linear-gradient(top, #207da2 0%, #207da2 100%) !important;
background-image: -o-linear-gradient(top, #207da2 0%, #207da2 100%) !important;
background-image: linear-gradient(to bottom, #207da2 0%, #207da2 100%) !important;
-webkit-box-shadow: inset 0 3px 3px #13485e !important;
box-shadow: inset 0 3px 3px #13485e !important;
border-color: #175973 !important;
}

</style>


<asp:Literal runat="server" ID="OutputLiteral"></asp:Literal>

<div id="baseuri" style="display: none;">
    <asp:Literal runat="server" ID="BaseUriLiteral"></asp:Literal>
</div>

<script type="text/javascript">
    var baseUriElement = document.getElementById('baseuri');
    if (baseUriElement && baseUriElement.innerHTML !== "") {
        var baseUri = baseUriElement.innerHTML;
        for (var i = 0; i < document.body.children.length; i++) {
            if (document.body.children[i].id == 'markup') continue;
            var images = document.body.children[i].getElementsByTagName('img');
            for (var j = 0; j < images.length; j++) {
                var image = images[j];
                if (image.attributes['src'].value.indexOf('http') !== 0) {
                    if (image.attributes['src'].value.indexOf('.') === 0) {
                        image.attributes['src'].value = baseUri + image.attributes['src'].value.replace('.', '');
                    }
                    else if (image.attributes['src'].value.indexOf('/') === 0) {
                        image.attributes['src'].value = baseUri + image.attributes['src'].value;
                    }
                    else {
                        image.attributes['src'].value = baseUri + '/' + image.attributes['src'].value;
                    }
                }
            }
        }  
    }

</script>