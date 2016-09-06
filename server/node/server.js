var http = require('http');
var qs = require('querystring');    //used for parsing requests
var request = require('request');   //used for sending requests to firebase

const PORT = 8080;  //port for inbound http
console.log(PORT);
function makeGroup(id) {

}

devices = //storing firebase verification tokens
    {
        "HypeSquad" : [],
        "TestGroup" : []
    }

groups = {"HypeSquad" :
            {
                "cheers" :
                {
                    "one" : "test"
                }
            },
            "leader" : "JJ"
        };



function handleRequest(request, response) {     //main server callback
    console.log("Requested")
    if(request.method == "GET" || request.method == "POST") {
        var body = [];
        request.on('data', function(data) {
            body += data;   //add data to request body
            //TODO make sure there's not too much data
        });
        request.on('end', function() {
            console.log("request: " + body);
            var json = JSON.parse(body);   //parse json from string

        if ("requestType" in json) {
            if(json.requestType == "pushnotify") {      //pushnotify means to send a specified data to clients
              /*
                requestJSON = {                         //construct request content
                    "url" : "https://fcm.googleapis.com/fcm/send",
                    "method" : "POST",
                    "headers" : {"Content-Type" : "application/json", "Authorization":"key=AIzaSyCI-f6i9hYYRGEBYOKgzYRzSSVrbBQEzkg"},
                    "body" :
                    JSON.stringify ({
                        "data" : { "message": json.messageString},
                        "to" : devices[json.groupID][0],
                    })
                }
                */
                var data = querystring.stringify({
                  JSON.stringify({
                    "data" : {
                      "message" : json.messageString
                    },
                    "to" : devices[json.groupID][0]
                  });
                });
                var options = {
                  "host" : "fcm.googleapis.com",
                  "path" : "/fcm/send",
                  "method" : "POST",
                  "protocol" : "https",
                  "headers" : {
                    "Content-Type" : "application/json",
                    "Content-Length" : Buffer.byteLength(data);
                  }
                }
                console.log("Sending firebase api request with Options: " + JSON.stringify(options) + " JSON Body: " + data);
                http.request(options, (res) => {
                  console.log("STATUS: ${res.statusCode}");
                  console.log("HEADERS: ${JSON.stringify(res.headers)}");
                  res.setEncoding('utf8');
                  res.on('data', (chunk) => {
                    console.log("BODY: ${chunk}");
                  });
                  res.on("end", () => {
                    console.log("End of response data... ");
                  })
                }).on("error", (e) => {       //if theres a problem creating the response log and error
                  console.log("Problem with request: ${e.message}");
                }).write(data).end()          //write data and tell http that were done


                /*
                request(requestJSON , function(error, response, body) { //send api request
                    if(error) {
                        console.log("HELP");
                        console.error(error, response, body);
                    } else if (response.statusCode >= 400){
                        console.error("HTTP ERROR: " + response.statusCode + " - " + response.statusMessage + "\n" + body);
                    } else {
                        console.log("Firebase request sent... MESSAGE: "); //?add message
                    }
                });
                */

            } else if (json.requestType == "cheer") {
                group = json.groupID
                //craft cheer response
            } else if(json.requestType == "joingroup") {    //if the client is trying to join a group
                response.setHeader('Content-Type', 'application/json');
                if (groups[json.groupID]) {     //see if group exists

                    console.log("Hello " + json.firetoken);

                    devices[json.groupID].push(json.firetoken);   //add firebase token to device list
                        var responseJSON =  //construct verification success response
                    {
                        "verified" : "true",
                        "groupID" : json.groupID
                    }
                    response.end(JSON.stringify(responseJSON)); //append verifcation to response
                } else {                        //group doesn't exist
                    var responseJSON =          //construct failed authentication response
                    {
                        "verified" : "false",
                        "groupID" : json.groupID
                    }
                    response.end(JSON.stringify(responseJSON));
                }
            }

        }

        });
      }
      //response.end("It Works!! Path Hit: " + request.url);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
  console.log("Server listening on port %s", PORT);
});
