var server = require("./server");
var router = require("./router");
var fs = require("fs");

var handle = {};
handle["/"] = home;

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
  response.write('<p><a href="#">Sign In</a></p>');
  response.end();
}