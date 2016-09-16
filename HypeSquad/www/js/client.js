app.push = PushNotification.init({
  "android": {
      "senderID" : "95902985488"
  },
  "ios": {
    "sound" : true,
    "vibration" : true,
    "badge" : true
  },
  "windows" {}
});

app.push.on("registration", function(data) {
  console.log("registration event: " + data.registrationId);
  var oldRegId = localStorage.getItem("registrationId")
  if(oldRegId !== data.registrationId) {
    localStorage.setItem('registrationId', data.registrationId);
  }
});

app.push.on('error', function(e) {
  console.log("push error = " + e.message);
})

app.push.on("notification", function(data) {
  console.log("notification recieved");
});
