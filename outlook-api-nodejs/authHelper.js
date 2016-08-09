var credentials = {
  clientID: "6a135cf5-2001-4fb5-bb13-195688fb42ef",
  clientSecret: "ZdDNQF8mAEgPzeeczS6xHF9",
  site: "https://login.microsoftonline.com/common",
  authorizationPath: "/oauth2/v2.0/authorize",
  tokenPath: "/oauth2/v2.0/token"
}
var oauth2 = require("simple-oauth2")(credentials);

var redirectUri = "http://localhost:8150/authorize";

// The scopes the app requires
var scopes = [ "openid",
               "https://outlook.office.com/mail.read" ];
    
function getAuthUrl() {
  var returnVal = oauth2.authCode.authorizeURL({
  redirect_uri: redirectUri,
  scope: scopes.join(" ")
  });
  console.log("Generated auth url: " + returnVal);
  return returnVal;
}

exports.getAuthUrl = getAuthUrl;