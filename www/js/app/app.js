define(["jquery", "ui/commands", "socketio"], function($, commands, io) {
  return {
    init: function() {
      console.log("APPLICATION INIT");

      var socket = io();

      socket.emit('load library');
      socket.on('library', function(data) {
        commands.load(data);
      });
    }
  }
});
