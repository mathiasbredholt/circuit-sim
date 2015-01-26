define(["jquery"], function($) {
  return {
    create: function(component) {

      $("#content").append(
        $("<div>")
        .html(component.name)
        .addClass("component")
        .offset({ top: 64, left: 64 })
        .mousedown(function() {
          var self = $(this), dragging = true;

          $(document).mouseup(function() {
            dragging = false;
          })
          .mousemove(function(e) {
            if (dragging) {
              self.css("left", Math.round((e.clientX - (self.width() / 2) / 8) * 8));
              self.css("top", Math.round((e.clientY - (self.height() / 2) / 8) * 8));
            }
          })
        })
      );
    }
  }
});
