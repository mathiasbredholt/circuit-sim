define(["jquery", "snap.svg"], function ($) {
  var dragging,
      wireStart,
      wireEnd,
      wire,
      x1, y1, x2, y2, dx, dy;
  
  return {
    
    init: function() {
      var s = Snap("#wiring");
      
      $("#wiring")
      .dblclick(function(e) {
        dragging = !dragging;
        x1 = Math.round(e.clientX / 8) * 8;
        y1 = Math.round(e.clientY / 8) * 8;
        
        if (dragging) {
          wire = s.line(x1, y1, x1, y1)
          .attr({strokeWidth:2, stroke:"black", strokeLinecap:"round"});
          wireStart = s.circle(x1, y1, 4);
          wireEnd = s.circle(x1, y1, 4);
        }
      })
      .click(function(e) {
        if (dragging) {
          x1 = x2;
          y1 = y2;

          wire = s.line(x1, y1, x1, y1)
          .attr({strokeWidth:2, stroke:"black", strokeLinecap:"round"});
          wireStart = s.circle(x1, y1, 4);
          wireEnd = s.circle(x1, y1, 4);
        }
      })
      .mousemove(function(e) {
        if (dragging) {
          x2 = Math.round(e.clientX / 8) * 8;
          y2 = Math.round(e.clientY / 8) * 8;
          dx = x1 - x2,
          dy = y1 - y2;
          
          if (!e.altKey) {
            if (Math.abs(dx) > Math.abs(dy)) {
              y2 = y1;
              dy = 0;
            } else {
              x2 = x1;
              dx = 0;
            }
          }
          
          
          wire.attr({ "x2": x2 , "y2": y2 });
          wireEnd.attr({ "cx": x2, "cy": y2 });
        }
      });
    }
  }
})
