var serverhost = "http://192.168.0.2:3000";

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

function getImage() {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(uploadPhoto, function(message) {
    alert('get picture failed');
  },{
    quality: 50,
    destinationType: navigator.camera.DestinationType.FILE_URI,
    sourceType: navigator.camera.PictureSourceType.CAMERA
  }
 );
}

function uploadPhoto(imageURI) {
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";

    var params = new Object();
    params.klass_id = "1";
    params.email = window.localStorage.getItem("user_email");
    params.token = window.localStorage.getItem("user_token");

    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(imageURI, serverhost + "/api/upload", win, fail, options);
}

function login(email, pw) {
  var xmlhttp;
  if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
    }
  else
    {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  xmlhttp.onreadystatechange=function()
    {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        //document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
        a = JSON.parse(xmlhttp.responseText);
        window.localStorage.setItem("user_token", a["result"]);
        window.localStorage.setItem("user_email", email);
        console.log("===== Sign up ====");
        console.log("CODE : " + a["code"]);
        console.log("RESULT : " + a["result"]);
        console.log("Saved Token : " + window.localStorage.getItem("user_token"));
        window.location.replace("index.html");
      }
  }
  xmlhttp.open("POST", serverhost + "/api/signup", true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send("email="+email+"&password="+pw);
}

function callList() {
  var xmlhttp;
  if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
    }
  else
    {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  xmlhttp.onreadystatechange=function()
    {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        //document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
        a = JSON.parse(xmlhttp.responseText);
        console.log("===== Call List ====");
        console.log("CODE : " + a["code"]);
        console.log("RESULT : " + a["result"]);
        document.getElementById("class_list").innerHTML = a["result"]
      }
  }
  email = window.localStorage.getItem("user_email");
  token = window.localStorage.getItem("user_token");
  xmlhttp.open("POST", serverhost + "/api/list", true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send("email="+email+"&token="+token);
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    alert("업로드 하였습니다");
}

function fail(error) {
    alert("업로드 실패 : Code = " = error.code);
}

function logout() {
  window.localStorage.clear();
  window.location.href = "login.html";
}

