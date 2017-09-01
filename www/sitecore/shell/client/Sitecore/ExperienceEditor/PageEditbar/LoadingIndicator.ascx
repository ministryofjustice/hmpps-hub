<%@ Control Language="C#" ClassName="LoadingIndicator" %>

<style>
  #ribbonPageShadow {
    z-index: 10001 !important;
    background: #aaa;
    opacity: .3;
    filter: Alpha(Opacity=30);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .sc-progressindicator-inner {
    height: 96px;
    width: 96px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -38px;
    margin-top: -38px;
    background: transparent url("/sitecore/shell/client/Speak/Assets/img/Speak/ProgressIndicator/sc-spinner32.gif") no-repeat center center;
    background-color: #ffffff;
    border-radius: 6px;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.175);
    -moz-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.175);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.175);
    z-index: 10001;
  }
</style>

<nav id='ribbonPreLoadingIndicator'>
  <nav id='scLoadingIndicatorInner'>
    <div id="ribbonPageShadow"></div>
    <div class="sc-progressindicator-inner"></div>
  </nav>
</nav>
