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
            //make sure there's not too much data
            /*
            if(body.length > 1e6) {
                request.connection.destroy(); //ABORT
            }
            */
        });
        request.on('end', function() {
            console.log("request: " + body);
            //body = qs.parse(body);              //stringifiy encoded request
            var json = JSON.parse(body); //parse json from string



        if ("requestType" in json) {
            if(json.requestType == "pushnotify") {      //pushnotify means to send a specified data to clients
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
                console.log("Sending firebase api request with JSON: " + JSON.stringify(requestJSON));
                http.request(requestJSON , function(error, response, body) { //send api request
                    if(error) {
                        console.log("HELP");
                        console.error(error, response, body);
                    } else if (response.statusCode >= 400){
                        console.error("HTTP ERROR: " + response.statusCode + " - " + response.statusMessage + "\n" + body);
                    } else {
                        console.log("Firebase request sent... MESSAGE: "); //?add message
                    }
                });

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
                    var responseJSON =          //
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
