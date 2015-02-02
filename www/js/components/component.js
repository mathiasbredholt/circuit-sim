define(["jquery", "server/server"], function($, Server) {
  return {
    create: function(component) {
      var dragging = false, origin = { left: 0, top: 0 };
      
      Server.send("getImg", component.img);
      
      Server.on("rcvImg", function(data) {
        var elem = $("<div>")
        .html(data)
        .addClass("component")
        .offset({ top: 64, left: 64 })
        .mousedown(function(e) {
          dragging = true;
          origin.left = e.clientX - elem.offset().left;
          origin.top = e.clientY - elem.offset().top;
          elem.toggleClass("componentHover");
        });
        
        $(document)
        .mouseup(function() {
          dragging = false;
          elem.toggleClass("componentHover");
        })
        .mousemove(function(e) {
          if (dragging) {
            elem.offset({
              left: Math.round((e.clientX - origin.left) / 8) * 8,
              top: Math.round((e.clientY - origin.top) / 8) * 8
            });
          }
        });

        $("#content").append(elem);
        
        Server.remove("rcvImg");
      })
    }
  }
});