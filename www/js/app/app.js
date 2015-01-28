define(["jquery", "ui/commands", "ui/wire", "socketio"], function($, Commands, wire, io) {
  return {
    init: function() {
      console.log("APPLICATION INIT");

      var socket = io();
      Commands.init(socket);

      //WIRE DRAWING
      wire.drawWire();
    }
  }
});
