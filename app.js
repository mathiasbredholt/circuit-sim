var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var fuzzy = require('fuzzy');

var library, options = {
  pre: '',
  post: '',
  extract: function(elem) { return elem.name; }
}

LoadLibrary();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/www/index.html");
});

app.use("/js", express.static(__dirname + "/www/js"));
app.use("/css", express.static(__dirname + "/www/css"));

io.on('connection', function(socket){
  console.log("a user is connected.");

  socket.on('search', function(msg) {
    SearchLibrary(msg, function(data) {
      io.emit('searchResult', data);
    });
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function LoadLibrary(callback) {
  fs.readFile('json/library.json', 'utf8', function(err, data) {
    library = JSON.parse(data);
  })
}

function SearchLibrary(input, callback) {
  var results = fuzzy.filter(input, library, options);
  var matches = results.map(function(elem) { return elem.string });
  callback(matches);
}