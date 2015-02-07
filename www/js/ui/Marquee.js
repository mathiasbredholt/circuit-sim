define(["jquery", "snap.svg", ], function($) {
  var select = false;

  return {
    init: function() {
      var dragging = false,
          x1, y1,
          x2, y2, w, h,
          dx, dy,
          rect;
      
      $("#content")
      .mousedown(function(e) {
        if (select) {
          dragging = true;
          x1 = e.clientX;
          y1 = e.clientY;
          
          var s = Snap("#wiring");
          rect = s.rect(x1, y1, 0, 0)
          .attr({ "stroke": "#000", "fill": "rgba(255, 255, 255, 0.4)", "stroke-width": "0.25px", "stroke-dasharray": "5,5", "vector-effect": "non-scaling-stroke" })
        }
      });
      
      $(document).mouseup(function() {
        if (select) {
          dragging = false;
          rect.remove();
        }
      })
      .mousemove(function(e) {
        if (dragging) {
          dx = e.clientX - x1;
          dy = e.clientY - y1;
          
          if (dx < 0) {
            x2 = e.clientX;
            w = Math.abs(x1 - x2);
          }
          else {
            x2 = x1;
            w = Math.abs(dx);
          }
          
          if (dy < 0) {
            y2 = e.clientY;
            h = Math.abs(y1 - y2);
          }
          else {
            y2 = y1;
            h = Math.abs(dy);
          }
                    
          rect.attr({ "x": x2, "y": y2, "width": w, "height": h });
        }
      })
    },
    select: select
  }
})