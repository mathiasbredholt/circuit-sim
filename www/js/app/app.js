define(["jquery", "server/server", "ui/commands", "ui/wire", "ui/svgwire"], function($, Server, Commands, wire, svgwire) {
  return {
    init: function() {
      console.log("APPLICATION INIT");

      Server.connect();
      
      Commands.init();

      //WIRE DRAWING
//      wire.drawWire();
      svgwire.init();
    }
  }
});
