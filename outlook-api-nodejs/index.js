var server = require("./server");
var router = require("./router");
var fs = require("fs");
var authHelper = require("./authHelper");
var url = require("url");
var outlook = require("node-outlook");

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
	console.log("Code: " + code);
	//response.writeHead(200, {"Content-Type": "text/html"});
	//response.write('<p>Received authentication code: ' + code + '<p>');
	//response.end();
	authHelper.getTokenFromCode(code, tokenReceived, response);
}

function getUserEmail(token, callback) {
	//Set the API endpoint to use the v2.0 endpoint
	outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

	//Set up oData parameters
	var queryParams = {
		'$select': 'DisplayName, EmailAddress'
	};

	outlook.base.getUser({token: token, odataParams: queryParams}, function(error, user) {
		if(error) {
			callback(error, null);
		}else {
			callback(null, user.EmailAddress);
		}
	});
}

function tokenReceived(response, error, token) {
	if (error) {
		console.log("Access token error: ", error.message);
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write('<p>ERROR: ' + error + '</p>');
		response.end();
	}
	else {
		getUserEmail(token.token.access_token, function(error, email){
			if (error) {
				console.log('getUserEmail returned an error: ' + error);
				response.write("<p>ERROR: " + error + "</p>");
				response.end();
			} else if(email){
				var cookies = ['issues-assigned-token=' + token.token.access_token + ';Max-Age=3600','issue-assigned-email=' + email + ';Max-Age=3600'];
       			response.setHeader('Set-Cookie', cookies);
        		response.writeHead(302, {'Location': 'http://localhost:8150/mail'});
        		response.end();
			}
		});
	}
}

function getValueFromCookie(valueName, cookie) {
  if (cookie.indexOf(valueName) !== -1) {
  	var start = cookie.indexOf(valueName) + valueName.length + 1;
    var end = cookie.indexOf(';', start);
    end = end === -1 ? cookie.length : end;
    return cookie.substring(start, end);
  }
}
