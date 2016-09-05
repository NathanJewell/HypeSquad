var http = require('http');
var qs = require('querystring');    //used for parsing requests

const PORT = 8080;  //port for inbound http
console.log(PORT);
function makeGroup(id) {

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
    if(request.method == "GET") {
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

            response.setHeader('Content-Type', 'application/json');

            if("groupID" in json) {
                //add device to list
                //var groupJSON = JSON.stringify(groups[json.groupID]);
                var responseJSON =
                {
                    "verified" : "true",
                    "groupID" : json.groupID
                }
                response.end(JSON.stringify(responseJSON));
                //response.end("Group " + json.groupID + " found");
            } else {
                var responseJSON =
                {
                    "verified" : "false",
                    "groupID" : json.groupID
                }
                response.end(JSON.stringify(responseJSON));
            }
        });
      }
      //response.end("It Works!! Path Hit: " + request.url);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
  console.log("Server listening on port %s", PORT);
});
