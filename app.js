var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/www/index.html");
});

app.use("/js", express.static(__dirname + "/www/js"));
app.use("/css", express.static(__dirname + "/www/css"));

io.on('connection', function(socket){
  console.log("a user is connected.");

  socket.on('load library', function(msg) {
    loadFile('library.json', function(data) {
      io.emit('library', data);
    })

  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function loadFile(path, callback) {
  fs.readFile('json/'+path, 'utf8', function(err, data) {
    callback(JSON.parse(data));
  })
}