var failures = 0;

if(typeof(scRequest.prototype.base_handle) == "undefined") { 

 scRequest.prototype.base_handle = scRequest.prototype.handle;
 
 scRequest.prototype.handle = function()
 {
  if (this.httpRequest.status != "200" 
      && failures < 2
      && ((this.httpRequest.responseText.indexOf("ThreadAbortException") > 0)
          || (this.httpRequest.responseText.indexOf("Server Un") > 0)
          || (this.httpRequest.responseText.indexOf("FileLoadException") > 0)
          || (this.httpRequest.responseText.indexOf("FileNotFoundException") > 0)))
  {
     failures++;
     return this.execute();
  }
  failures = 0;
  return scRequest.prototype.base_handle.call(this, arguments);
 }
}

function UnregisterHandler() {
   if(scRequest.prototype.base_handle != null) {
      scRequest.prototype.handle = scForm.request.base_handle;
      scRequest.prototype.base_handle = null;
   }
}
