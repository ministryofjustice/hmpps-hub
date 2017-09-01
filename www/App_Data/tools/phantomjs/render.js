var page = require('webpage').create(),
  system = require('system'),
  url = system.args[1],
  filename = system.args[2],
  width = system.args[3],
  height = system.args[4],
  domain = system.args[6],
  cookies = domain && system.args[5];

if (cookies) {
  var arr = cookies.split("; ");
  for (var i = 0; i < arr.length; i++) {
    var cookie = arr[i].split("=");
    if (cookie.length < 2) {
      continue;
    }

    phantom.addCookie({
      'name': cookie[0],
      'value': cookie[1],
      'domain': domain
    });
  }
}

page.viewportSize.width = width;
page.viewportSize.height = height;

page.open(url,
  function () {
    page.render(filename);
    phantom.exit();
  });
