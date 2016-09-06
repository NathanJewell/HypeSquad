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

        var methodComplete = true;  //var for storing wether or not client request was successful true by default

        if ("requestType" in json) {
            if(json.requestType == "pushnotify") {      //pushnotify means to send a specified data to clients
                var data = qs.stringify(
                    {
                        "data" : {
                            "message" : json.messageString
                        },
                        "to" : devices[json.groupID][0]
                    }
                );

                var options = {
                  "host" : "fcm.googleapis.com",
                  "path" : "/fcm/send",
                  "method" : "POST",
                  "headers" : {
                    "Content-Type" : "application/json",
                    "Authorization" : "key=AIzaSyCI-f6i9hYYRGEBYOKgzYRzSSVrbBQEzkg",
                    "Content-Length" : Buffer.byteLength(data)
                  }
                }

                console.log("Sending firebase api request with Options: " + JSON.stringify(options) + " JSON Body: " + data);
                var req = http.request(options, (res) => {
                  console.log("STATUS: ${res.statusCode}");
                  console.log("HEADERS: ${JSON.stringify(res.headers)}");
                  res.setEncoding('utf8');
                  res.on('data', (chunk) => {
                    console.log("BODY: ${chunk}");
                  });
                  res.on("end", () => {
                    console.log("End of response data... ");
                  })
                })
                req.on("error", (e) => {       //if theres a problem creating the response log and error
                  console.log("Problem with request: ${e.message}");
                  methodComplete = false;
                });
                req.write(data);    //write data
                req.end();          //tell http that were done

                //tell client that we sent the request
                var responseJSON = {
                  "methodComplete" : methodComplete,
                  "groupID" : json.groupID,
                  "verified" : "true"
                }

                response.end(json.stringify(responseJSON)); //tell client what up

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
