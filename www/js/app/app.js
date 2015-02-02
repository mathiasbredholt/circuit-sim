define(["jquery", "server/server", "ui/commands", "ui/wire"], function($, Server, Commands, wire) {
  return {
    init: function() {
      console.log("APPLICATION INIT");

      Server.connect();
      
      Commands.init();

      //WIRE DRAWING
      wire.drawWire();
    }
  }
});
