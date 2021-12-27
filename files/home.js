var ctx;
var canvas;
var socket;
var data = null;

var page;
var width;
var height;
var account;
var loading;

var camera;
var scale;

var signin;
var signup;
var message;

var oneMessage = false;
var loginMode = true;
var noConnect = true;
var tile_res = 100;

var username = "";
var password = "";
var imageNames = ["grass", "puff"];

var images = {};

var keysDown = new Set();
var justDown = new Set();


function posToScreen(x, y) {
  return [
    (x - camera["x"]) * scale + width / 2,
    (camera["y"] - y) * scale + height / 2
  ];
}

function draw() {
  window.requestAnimationFrame(draw);
  if (!data) {
    return;
  }

  noConnect = false;
  
  document.getElementById("game").style.display = "flex";
  loading.style.display = "none";

  scale = height / camera["size"];

  width = window.innerWidth - 2;
  canvas.width = width;
  height = window.innerHeight - 2;
  canvas.height = height;

  background(data["background"]);

  for (var imageIndex in data["images"]) {
    var imageData = data["images"][imageIndex];
    var image = images[imageData["sprite"]];
    var size = imageData["size"];
    var imageSize = scale * size;
    var pos = posToScreen(imageData["x"], imageData["y"]);
    ctx.drawImage(image, pos[0] - imageSize / 2, pos[1] - imageSize / 2, imageSize, imageSize);
  }
}

function background(color) {
  page.style.backgroundColor = color;

  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = color;
  ctx.fill();  
}

function frame() {
  // console.log(keysDown);
  // console.log(oldKeysDown);

  socket.send(JSON.stringify({
    "username": username,
    "password": password,
    "keys_down": Array.from(keysDown),
    "just_down": Array.from(justDown)
  }));

  justDown = new Set();
}

window.onload = open;

function keyDown(e) {
  justDown.add(e.code);
  keysDown.add(e.code);
}

function keyUp(e) {
  keysDown.delete(e.code);
}

function open() {
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);

  for (var imageNameIndex in imageNames) {
    var imageName = imageNames[imageNameIndex];
    images[imageName] = document.getElementById(imageName);
  }

  signin = document.getElementById("signin");
  signup = document.getElementById("signup");
  message = document.getElementById("message");

  signin.onsubmit = function(evt) {
    username = document.getElementById("signin-username").value;
    password = document.getElementById("signin-password").value;
    start("signin");
    evt.preventDefault();
  }

  signup.onsubmit = function(evt) {
    username = document.getElementById("signup-username").value;
    password = document.getElementById("signup-password").value;
    start("signup");
    evt.preventDefault();
  }

  document.getElementById("signin-mode").onclick = function() {
    signin.style.display = "block";
    signup.style.display = "none";
  }

  var homes = document.getElementsByClassName("home");
  for (var homeIndex in homes) {
    var home = homes[homeIndex];
    home.onclick = function() {
      game.style.display = "none";
      message.style.display = "none";
      signin.style.display = "block";
      signup.style.display = "none";
      account.style.display = "block";
    }
  }

  document.getElementById("signup-mode").onclick = function() {
    signin.style.display = "none";
    signup.style.display = "block";
  }
}

function start(connnectType) {
  socket = new WebSocket('wss://PuffIO-Backend.martinstaab.repl.co:443/');
  
  socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({"username": username, 
    "connnectType": connnectType, "password": password}));
    frame();
  });

  socket.addEventListener('message', function (event) {
    oneMessage = true;
    var fromServer = JSON.parse(event.data);
    if (fromServer["type"] == "frame") {
      loginMode = false;
      data = fromServer["data"];
      camera = fromServer["camera"];
    } else if (fromServer["type"] == "error") {
      error(fromServer["data"]);
    }
    frame();
  });

  socket.addEventListener('close', function (event) {
    if (!loginMode || !oneMessage) {
      alert("Connection to server lost!")
      if (noConnect) {
        alert("Server is not running.");
      }
      location.reload();
    }
    oneMessage = true;
  });

  account = document.getElementById("account")
  account.style.display = "none";
  canvas = document.getElementById("canvas");
  loading = document.getElementById("loading");
  loading.style.display = "grid";
  ctx = canvas.getContext("2d");
  page = document.getElementById("everything");
  
  window.requestAnimationFrame(draw);
}

function error(messageContent) {
  document.getElementById("game").style.display = "none";
  document.getElementById("account").style.display = "block";

  signin.style.display = "none";
  signup.style.display = "none";
  message.style.display = "block";
  loading.style.display = "none";

  document.getElementById("messageContent").innerText = messageContent;
}
