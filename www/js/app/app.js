define(["jquery", "ui/commands", "ui/wire", "socketio"], function($, commands, wire, io) {
  return {
    init: function() {
      console.log("APPLICATION INIT");

      var socket = io();

      socket.emit('load library');
      socket.on('library', function(data) {
        commands.load(data);
      });

      //WIRE DRAWING
      wire.drawWire();
    }
  }
});
