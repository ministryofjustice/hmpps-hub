<%@ Page Language="C#" EnableViewState="false" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="Sitecore.Shell.Applications.Preview.SimulatedDevicePreview.Layouts.Default" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.ExperienceEditor" %>
<!DOCTYPE html>

<html>
<head runat="server">
    <title></title>    
    <script type="text/javascript" src="/sitecore/shell/Controls/Lib/Modernizr/Modernizr.js"></script>
    <style type="text/css">
      body, iframe
      {
        background-color: White;
      }

      body, html
      {
        height: 100%;
        padding: 0;
        margin: 0;      
      }

      html
      {
        overflow-y:scroll;
      }
      
      #device
      {       
        position: absolute;       
        margin-left:50%;   
        background-repeat:no-repeat;
        background-position: center top;                       
      }

      #content
      {                 
        position:relative;
        margin:20px 0;
        width:100%;      
      }
    
      #screenContainer
      {      
        position: absolute;                       
      }

      .scFixedRibbon.scCollapsedRibbon ~ #RotateButton
      {
        top: 58px;
      }

      .scFixedRibbon.scCollapsedRibbon ~ #ScaleSection
      {
        top: 150px;
      }

       .scFixedRibbon.scTreecrumbVisible ~ #RotateButton
      {        
        top: 200px;
      }

       .scFixedRibbon.scTreecrumbVisible ~ #ScaleSection
      {        
        top: 180px;
      }

      .scFixedRibbon ~ #ScaleSection
      {
        padding-top: 10px;
      }
      
      #RotateButton, #ScaleSection
      {
        position:fixed;
        right: 20px;       
        z-Index: 200;        
      }

      #RotateButton
      {
        padding-top: 30px;
      }
     
      .rotate.down:hover
      {
        box-shadow: 1px -1px 0px 0px #A0A0A0;
        filter:alpha(opacity=90);       
        right: -3px;
      }

      .rotate:hover
      {
        filter:progid:DXImageTransform.Microsoft.Shadow(color='#B0B0B0', Direction=135, Strength=3) alpha(opacity=90);
        opacity: 0.9;
        cursor:pointer;
        text-decoration: none; 
      }

      .rotate
      {
        position: absolute;        
        padding: 4px;
        min-width: 50px;        
        right: 0;                                              
        border-top: 1px solid #9E9E9E;        
        border-left: 1px solid #9E9E9E; 
        border-bottom:  1px solid #8E8E8E;
        border-right: 1px solid #8E8E8E;               
        opacity:0.45;
        text-align:center;
        border-radius: 5px;
        box-shadow: 1px -1px 0px 0px #A0A0A0, 3px 3px 3px 0px #B0B0B0;
        filter: progid:DXImageTransform.Microsoft.Shadow(color='#B0B0B0', Direction=135, Strength=3) alpha(opacity=45);                
        background: #DBE6E8 url('/sitecore/shell/themes/standard/images/graygradient1x55.png') repeat-x top left;
        z-Index: 100;        
      }

      :root .rotate
      {
        filter: "";
      }

      .rotated .rotate-icon
      {
        background-image: url('/sitecore/shell/~/icon/ApplicationsV2/32x32/nav_redo_blue.png.aspx');
      }

      .rotate-icon
      {        
        height: 32px;
        width: 32px;
        margin: 0 auto;            
        background: url('/sitecore/shell/~/icon/ApplicationsV2/32x32/nav_undo_blue.png.aspx') no-repeat center center;        
        z-index:0;        
      }

      .rotate-text
      {
        font-family: Tahoma,Verdana,Sans-Serif;        
        font-size: 11px;       
        color: #666;        
      }

      .fixLeftSide
      {
        margin-left: 0px !important;
        left: 0px !important;
      }
            
      /*Scale Styles*/
      #ScaleTrack
      {
        z-Index: 250;
        width:100px;
        position:relative;
        background-color:#ccc; 
        height:11px; 
        cursor: pointer; 
        background:transparent url(/sitecore/shell/Themes/Standard/Reports/track-repeat.png) repeat-x center left;
        background-position:8px left; 
        opacity: 0.55;
      }

      #ScaleSection
      {              
        width:152px;        
        text-align: left;
        color: #666;
        font-family: Tahoma,Verdana,Sans-Serif;
        font-size: 11px;
      }
      
       #ScaleTrack:hover
       {
        opacity: 0.9;
       }

       .sc-no-csstransforms #ScaleSection
       {
        display: none;
       }
          
      #ScaleTrack:before
      {
        content:"";
        display:block;
        position:absolute;
        left: -5px; 
        width: 5px; 
        height: 11px; 
        background: transparent url(/sitecore/shell/Themes/Standard/Reports/track-left.png) no-repeat center left;
      }

      #ScaleTrack:after
      {
        content:""; 
        display:block;       
        position:absolute;        
        top: 0px;
        left: 100px;
        width: 5px;
        height: 11px;
        background: transparent url(/sitecore/shell/Themes/Standard/Reports/track-right.png) no-repeat center right;
      }
      
      #ScaleHandle
      {
        width:12px;
        height:12px;
        cursor: move;
        position: relative;
        background-color: #589BDC;
        background-image: none;
        background-image: -webkit-gradient(linear, left top, left bottom, from(#488CD0), to(#D7FEFF));
        background-image: -moz-linear-gradient(top, #488CD0, #D7FEFF);
        background-image: -ms-linear-gradient(top,  #488CD0,  #D7FEFF);
        background-image: linear-gradient(top,  #488CD0,  #D7FEFF);
        border-radius: 12px;
        border:1px solid #003D9F;
        border-top-color:#001562;
        border-bottom-color:#6E95BB;        
      }
                              
      /*Custom srollbar styles*/
      .jspDrag
      {       
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        border: 1px solid #707070  !important;
        background-color: #C0C0C0 !important;
        opacity: 0.35;
        filter: alpha(opacity=35); 
      }
      
      .jspTrack, .jspVerticalBar, .jspHorizontalBar
      {
        background-color: transparent !important;
      }

      .jspVerticalBar
      {        
        width: auto !important;
      }
      
      .jspVerticalBar .jspDrag
      {
        width: 8px !important;
        margin: 1px 2px 0px 3px !important
      }      
            
      .jspHorizontalBar
      {
        height: auto !important;
      }
                  
      .jspHorizontalBar .jspDrag
      {
        height: 8px !important;
        margin: 3px 0px 2px 1px !important;        
      }
           
      .jspCorner
      {
        display: none;
      }
      
      .jspHorizontalBar:hover .jspDrag, .jspVerticalBar:hover .jspDrag, jspDrag.jspHover
      {
        opacity: 0.65;
        filter: alpha(opacity=65);
      }
      
      .jspVerticalBar .jspActive.jspDrag
      {
        margin-left: 23px !important;       
      }
      
      .jspHorizontalBar .jspActive.jspDrag
      {
        margin-top: 23px !important;       
      }                                                      
    </style>
    <link type="text/css" rel="stylesheet" href="/sitecore/shell/Controls/Lib/jQuery/jScrollPane/jquery.jscrollpane.css" />
    <script type="text/javascript" src="/sitecore/shell/controls/Lib/Prototype/prototype.js"></script>
    <script type="text/javascript" src="/sitecore/shell/controls/lib/scriptaculous/slider.js"></script>                      
</head>
<body>    
    <form id="form1" runat="server">
      <script type="text/javascript" src="/sitecore/shell/Applications/Page Modes/Utility.js"></script> 
      <script type="text/javascript" src="/sitecore/shell/Controls/Lib/jQuery/jquery.mousewheel.js"></script>      
      <script type="text/javascript" src="/sitecore/shell/Controls/Lib/jQuery/jScrollPane/jquery.jscrollpane.js"></script>
      <script type="text/javascript" src="/sitecore/shell/Controls/Lib/Console/ConsoleStub.js"></script>
      <script type="text/javascript" src="/sitecore/shell/Applications/Preview/SimulatedDevicePreview/Layouts/DeviceRotation.js"></script>                      
      <asp:HiddenField runat="server" ID="SimulatorId" />
      <asp:HiddenField runat="server" ID="Scale" />
      <asp:HiddenField runat="server" ID="ScaleValues" />     
      <div id="ScaleSection">       
       <div style="float:right;margin-right:5px;">
       <div id="ScaleTrack">               
         <div id="ScaleHandle">                         
          </div>                
         </div>
       </div>
        <div style="float:right;margin-right:12px;">
          <span id="ScaleValue"></span>   
        </div>
      </div>

      <div runat="server" id="RotateButton" Visible="false">
       <div class="rotate"> 
          <div class="rotate-icon"></div>
          <asp:Label id="RotateText" CssClass="rotate-text" runat="server"></asp:Label>
        </div>
      </div>      

      <div runat="server" id="content">                          
        <div id="device" runat="server">       
          <div id="screenContainer" runat="server">          
            <div id="paneContainer"><div id="pane"><iframe style="display:none;overflow:hidden" scrolling="no" runat="server" frameborder="0" id="screen" marginheight="0" marginwidth="0" name="screen" src="about:blank" /></div></div> 
          </div>
        </div>      
      </div>
    </form>    
    <script type="text/javascript">     
      var frameContentPersistedSize;     
      var widthInaccuracy = 5, heightInaccuracy = 5;
      var sizeObservingInterval = 750;
      var intervalId;
      var scrollingPane;
      var rotationCookieName = 'sc_rotated_simulator_id';
      var theScreen = document.getElementById("screen");
      var simulatotId = document.getElementById("SimulatorId").value;      
      var rotateButton = document.getElementById("RotateButton");
      var scrollingSettings = {
          internalScrolling: true,         
          verticalGutter: 0,
          horizontalGutter: 0,
          pane: $sc("#pane"),
          container: $sc("#paneContainer")
      };
     
      var scaleValuesString = document.getElementById("ScaleValues").value || "";      
      var scaleValues = scaleValuesString.split("|").map(function(el) {return parseInt(el, 10);});
      var min = scaleValues.min();
      var max = scaleValues.max();
      if (!Modernizr.csstransforms) {
        document.getElementById("Scale").value = "100";
      }

      tryFixLargeSimulator();
      var currentScaleValue = document.getElementById("Scale").value;     
      $sc("#ScaleValue").html(currentScaleValue + "%");      
      new Control.Slider('ScaleHandle', 'ScaleTrack', {
        minimum: min,
        maximum: max,
        sliderValue: parseInt(currentScaleValue),       
        range: $R(min, max),
        values: scaleValues,
        onSlide: function(v) {  
          scaleContent(v);
          tryFixLargeSimulator();
        },
        onChange: function(v) {
          scaleContent(v);
          tryFixLargeSimulator();
      }});
              
      if ($sc.browser.msie && document.documentMode && document.documentMode < 9) {
        changeRotateButtonPositionOnRibbonResize();
      }

      $sc(".rotate").mousedown(
        function() {
           $sc(this).addClass("down");
        }
      ).bind("mouseup mouseleave", function() {
        $sc(this).removeClass("down");
      })

      var isRunningInsideFrame = window.parent != window.self;
      if (isRunningInsideFrame) {
        changePosition();
      }
            
      theScreen.onload = function() {                                      
        try {
          if (!(theScreen.contentDocument || theScreen.contentWindow.document)) {
            return;
          }
        }
        catch (err) {
          return;
        }
        
        if(theScreen.src === "about:blank") {
          return;
        }
                                        
        addBaseTarget(theScreen);
        fixAnchors(theScreen);
        applyCustomScrollbars();        
        initFrameContentSizeObserver();        
      };

      
      function scaleContent(v) {
        var value = "scale(" + v/100 + ")";
        var content = document.getElementById("content");
        content.style.MozTransform = value;
        content.style.webkitTransform = value;
        content.style.msTransform = value;
        content.style.transform = value;
        $sc("#ScaleValue").html(v + "%");
        $sc("#Scale").val(v);
      };

      function applyCustomScrollbars() {
        theScreen.style.display = "";
        theScreen.style.height = "";
        theScreen.style.width = "";
        var $scscreenContainer =  $sc("#screenContainer").show();        
        frameContentPersistedSize = adjustFrameSize(theScreen);           
        var frameDocument = theScreen.contentDocument || theScreen.contentWindow.document;
        scrollingSettings.mouseWheelTargetElement = $sc(frameDocument.body);  
        scrollingPane = $scscreenContainer.jScrollPane(scrollingSettings).data('jsp');                        
      }
             
      function adjustFrameSize(frame, s) {        
        var size = s || getFrameContentSize(frame);           
        var $scframe = $sc(frame);
        var $sccontainer = $sc("#screenContainer");
        var height = Math.max(size.height, $sccontainer.height());
        var width = Math.max(size.width, $sccontainer.width());
        size = {height: height, width: width};        
        $scframe.css({height: size.height + "px", width: size.width + "px"});
        return size;         
      };

      function fixAnchors(frame) {
         var frameDocument = frame.contentDocument || frame.contentWindow.document;
         //Preventing anchors form reloading the parent window. (Due to BASE tag)
         $sc("a[href^=#]", frameDocument).attr("target", "_self");
      };

      function initFrameContentSizeObserver() {       
        if (Sitecore.PageModes.Utility.isNoStandardsIE()) {
          return;
        }

        if (intervalId) {
          return;
        }
            
        intervalId = setInterval(function() {
          var s = frameContentHasResized(theScreen);
          if (!s) {
            return;
          }

          try {            
            adjustFrameSize(theScreen, s);
            if (scrollingPane) {
              scrollingPane.reinitialise();
            }
          }
          catch(err) {
            clearInterval(intervalId);
            intervalId = null;
            console.log("An error occured during frame resizing");
          }                                
         }, sizeObservingInterval); 
      };

      function stopFrameContentSizeObserver() {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };

      function frameContentHasResized(frame) {
        var newSize = getFrameContentSize(frame);                       
        if (!frameContentPersistedSize) {
          frameContentPersistedSize = newSize;
          return null;
        }
                
        if (Math.abs(frameContentPersistedSize.height - newSize.height) > heightInaccuracy ||
            Math.abs(frameContentPersistedSize.width - newSize.width) > widthInaccuracy) {
          frameContentPersistedSize = newSize;
          return newSize;
        }
                
        return null;        
      };

      function getFrameContentSize(frame) {       
        var $scdoc = $sc(frame.contentDocument || frame.contentWindow.document);                            
        var result =  {height: $scdoc.height(), width: $scdoc.width()};             
        return result;
      };
      
      function addBaseTarget(frame) {
        var doc, head, baseTag, html, elementId = "scBaseElement";                 
        doc = frame.contentDocument || frame.contentWindow.document;
        if (!doc) {
          return;
        }

        if (doc.getElementById(elementId)) {
          return
        }
                  
        baseTag = doc.createElement("base");
        baseTag.setAttribute("target", "_parent");
        baseTag.id = elementId;
        head = doc.getElementsByTagName("head")[0]; 
        head.appendChild(baseTag);                          
      };
      
      function changePosition() {        
        if (rotateButton) {
          rotateButton.style.position = "absolute";
        }

        var scale = document.getElementById("ScaleSection");
        if (scale) {
          scale.style.position = "absolute";
        }        
      };
     
      var device = document.getElementById("device");
      if (rotateButton && device) {
        var rotator = new DeviceRotation(rotateButton, device, $sc);
        rotator.setRotationStartHandler(function() {                           
          stopFrameContentSizeObserver();                 
          if (scrollingPane) {                         
            scrollingPane.destroy();                       
          }
          
          $sc("#screenContainer").hide();                   
        });

        rotator.setRotationEndHandler(function() {                                                           
           tryFixLargeSimulator();
           applyCustomScrollbars();
           initFrameContentSizeObserver(); 
           if (rotator.isRotated() && simulatotId) {
            Sitecore.PageModes.Utility.setCookie(rotationCookieName, simulatotId, ""); 
           }
           else {
            Sitecore.PageModes.Utility.removeCookie(rotationCookieName); 
           }                                         
        });
      }
      
      function changeRotateButtonPositionOnRibbonResize() {
        $sc("#scWebEditRibbon.scFixedRibbon").resize(function() {
            var height = $sc(this).height();
            if (rotateButton) {
              var rotateButtonOffset = 15;
              rotateButton.style.top = height + rotateButtonOffset + "px";
            }
          });
      }
      
      function tryFixLargeSimulator() {
        try {        
          var v = $sc("#Scale").val();
          var ratio = v /100;
          var device = $sc("#device");
          var center = $sc("#content").width() / 2;
          if (device.is(".fixLeftSide")) {
            device.removeClass("fixLeftSide");
          }

          var left = parseFloat(device.css("left"));                    
          if ((center + left * ratio) < 0) {
            device.addClass("fixLeftSide");
          }
        }
        catch(exc) {
          //silent
        }        
      };    
    </script>  
</body>
</html>
