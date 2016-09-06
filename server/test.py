import requests, json, logging

#try:
#    import http.client as http_client
#except ImportError:
    #P2
#    import httplib as http_client
#http_client.HTTPConnection.debuglevel=1
url = "http://54.186.37.227:8080"

payload = {
        "requestType" : "joingroup",
        "groupID" : "HypeSquad",
        "verified":"false"
    }

firebasePayload = {
        "requestType" : "pushnotify",
        "groupID" : "HypeSquad",
        "messageString" : "This is from your master."
    }

#logging.basicConfig()
#logging.getLogger().setLevel(logging.DEBUG)
#requests_log = logging.getLogger("requests.packages.urllib3")
#requests_log.setLevel(logging.DEBUG)
#requests_log.propagate = True

#r = requests.get(url, json=payload)
r = requests.get(url, json=firebasePayload)
print(r.text)
print(r.request)
