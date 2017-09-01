define({
  load: function (name, req, load, config) {
    var fileName = config.paths[name] || name;

    if (fileName.substr(0, 1) != "/" && fileName.substr(fileName.length - 4, 4).toLowerCase() != ".css") {
      fileName = config.baseUrl + fileName;
    }

    if (fileName.indexOf(".css", fileName.length - 4) === -1) {
      fileName += ".css";
    }

    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = fileName;
    link.rel = 'stylesheet';
    link.type = 'text/css';

    head.appendChild(link);

    load(true);
  }
});
