var http = require('http');
var qs = require('querystring');    //used for parsing requests
var request = require('request');   //used for sending requests to firebase
var firebase = require("firebase");

var fbConfig = {
  apiKey: "AIzaSyBF37NU7bte97tlbNtLnAei-9zoeU_oETw",
  authDomain: "hypesquad-8ab9e.firebaseapp.com",
  databaseURL: "https://hypesquad-8ab9e.firebaseio.com",
  storageBucket: "hypesquad-8ab9e.appspot.com",
  messagingSenderId: "95902985488"
};
firebase.initializeApp(fbConfig);

const PORT = 8080;  //port for inbound http
console.log(PORT);

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

function addDeviceToFirebaseGroup(group, token) {
    console.log("Adding device " + token + " to Firebase group " + group);
    var data = {
        "operation" : "add",
        "notification_key_name" : groups[group].FBgroupName,
        "notification_key" : groups[group].FBgroupKey
        //"registration_ids" : [token]                            //original device to add (device that made group);
    }
    var options = {
      "host" : "android.googleapis.com",
      "path" : "/gcm/notification",
      "method" : "POST",
      "headers" : {
        "Content-Type" : "application/json",
        "Authorization" : "key=AIzaSyCI-f6i9hYYRGEBYOKgzYRzSSVrbBQEzkg",
        "Content-Length" : Buffer.byteLength(data)
      }

      console.log("Sending request with \nOPTIONS: " + JSON.stringify(options) + "\nJSON Body: " + data);
      var req = http.request(options, (res) => {
        console.log("STATUS: " + res.statusCode);
        console.log("HEADERS: " + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log("BODY: " + chunk);
        });
        res.on("end", () => {
          console.log("End of response data... ");
        })
      })
      req.on("error", (e) => {       //if theres a problem creating the response log and error
        console.log("Problem adding device to firebase group: " + e.message);
        methodComplete = false;
      });
      req.write(data);    //write data
      req.end();          //tell http that were done

      //tell client that we sent the request
      var responseJSON = {
        "methodComplete" : methodComplete,
        "groupID" : group,
        "verified" : "true"
      }

      response.end(JSON.stringify(responseJSON)); //tell client what up


}

function makeFirebaseGroup(group, admin) {
    var data = {
        "operation" : "create",
        "notification_key_name" : group,
        "registration_ids" : [admin]
    }

    var options = {
      "host" : "android.googleapis.com",
      "path" : "/gcm/notification",
      "method" : "POST",
      "headers" : {
        "Content-Type" : "application/json",
        "Authorization" : "key=AIzaSyCI-f6i9hYYRGEBYOKgzYRzSSVrbBQEzkg",
        "Content-Length" : Buffer.byteLength(data)
      }

      console.log("Sending firebase api request with Options: " + JSON.stringify(options) + " JSON Body: " + data);
      var req = http.request(options, (res) => {
        console.log("STATUS: " + res.statusCode);
        console.log("HEADERS: " + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            var json = JSON.parse(chunk);
            groups[group].FBgroupKey = json.notification_key;
            console.log("Group key recieved: " + json.notification_key);
        });
        res.on("end", () => {
          console.log("End of response data... ");
        })
      })
      req.on("error", (e) => {       //if theres a problem creating the response log and error
        console.log("Problem with request: " + e.message);
        methodComplete = false;
      });
      req.write(data);    //write data
      req.end();          //tell http that were done
}

function sendFirebaseMessage(group, data) {
    var data = JSON.stringify(
        {
            "data" : {
                "message" : data
            },
            "to" : devices[group][0]
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
      console.log("STATUS: " + res.statusCode);
      console.log("HEADERS: " + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log("BODY: " + chunk);
      });
      res.on("end", () => {
        console.log("End of response data... ");
      })
    })
    req.on("error", (e) => {       //if theres a problem creating the response log and error
      console.log("Problem with request: " + e.message);
      methodComplete = false;
    });
    req.write(data);    //write data
    req.end();          //tell http that were done

    //tell client that we sent the request
    var responseJSON = {
      "methodComplete" : methodComplete,
      "groupID" : group,
      "verified" : "true"
    }

    return JSON.stringify(responseJSON); //tell client what up

} //returns JSON

function addClientToGroup(group, FBtoken) {
    response.setHeader('Content-Type', 'application/json');
    var responseJSON =          //construct failed authentication response
    {
        "verified" : "false",   //will be set to true if verified
        "groupID" : group
    }

    if (groups[json.groupID]) {     //see if group exists
        responseJSON.verified = "true";
        response.end(JSON.stringify(responseJSON)); //append verifcation to response

        addDeviceToFirebaseGroup(json.groupID, json.firetoken);   //add firebase token to group with api

        var users = groups[group].users.parseInt();
        users += 1;
        groups[group].users = users.toString();
    } else { ]                       //group doesn't exist

    response.end(JSON.stringify(responseJSON)); //return JSON to tell client whats up with their request

} //returns JSON

function makeGroup(group, FBtoken) {
    if(!group in groups) {   //make sure group doesn't allready exists
        var responseJSON = {};  //empty object to store response
        groups[group] = {
            "users" : "1",
            "cheers" : {},
            "FBgroupName" : "none",
            "FBgroupKey" : "none"
        }

        if(makeFirebaseGroup(group, FBtoken)) {  //both adds client and makes group
            var users = groups[group].users.parseInt();
            users += 1;
            groups[group].users = users.toString();
        } else {
            responseJSON = {
                "groupID" : group;
                "popup" : {
                    "title" : "Could not create  " + group,
                    "message" : "Error making firebase group.",
                    "button" : "OK"
                }
            }
        }

    } else {
        responseJSON = {
            "groupID" : group;
            "popup" : {
                "title" : "Could not create " + group,
                "message" : "Allready exists",
                "button" : "OK"
            }
        }

    }
    return responseJSON;
}   //returns JSON

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

        if ("type" in json) {
            if("data" in json) {
              json.data = JSON.parse(json.data);  //convert stringified data from client to useful json
            }
            if(json.type == "pushnotify") {      //pushnotify means to send a specified data to clients
                response.end(sendFirebaseMessage(json.groupID, json.data.messageString));
            } else if (json.type == "cheer") {
                group = json.groupID
                //craft cheer response
            } else if(json.type == "joingroup") {    //if the client is trying to join a group
                response.end(addClientToGroup(json.groupID, json.firetoken));
            } else if(json.type == "makegroup") {
                response.end(makeFirebaseGroup(json.groupID, json.firetoken));
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
