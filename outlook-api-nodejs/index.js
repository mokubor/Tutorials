var server = require("./server");
var router = require("./router");
var fs = require("fs");
var authHelper = require("./authHelper");
var url = require("url");

var handle = {};
handle["/"] = home;
handle["/authorize"] = authorize;

server.start(router.route, handle);

function home(response, request) {
  console.log("Request handler 'home' was called.");
  /*fs.readFile("public/index.html", function(err, data){
    if(err){
	  console.log("Couldnt foint index.html");
	  response.writeHead(404);
	  response.write("Page Not FOund");
	}
	else{
	  console.log("loading Index.html");
	  response.writeHead(200, {'Content-Type': "text/html"});
	  response.write(data);
	}
	response.end();
  });*/
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write('<p><a href="'+ authHelper.getAuthUrl() +'">Sign In</a></p>');
  response.end();
}

function authorize(response, request) {
	console.log("Request handler 'authorize' was called. ");

	//The authorization code is passed as a query parameter
	var url_parts = url.parse(request.url, true);
	var code = url_parts.query.code;
	cosole.log("Code: " + code);
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write('<p>Received authentication code: ' + code + '<p>');
	response.end();
}