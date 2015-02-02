define(["jquery", "svgjs"], function ($) {
  return {
    init: function() {
      var dragging, wireStart, wireEnd, wire, beginX, beginY, diagonalWire, wireLength, wireCenterX, wireCenterY, wireAngle;
      
      var svg = SVG("wiring");
      
      $("#wiring")
      .mousedown(function(e) {
        dragging = true;
        beginX = Math.round(e.clientX / 8) * 8;
        beginY = Math.round(e.clientY / 8) * 8;
        
        wire = svg.line(beginX, beginY, beginX, beginY).stroke({ width: 2 })
        wireStart = svg.circle(8).fill('#000');
        wireStart.move(beginX - 4, beginY - 4);
        wireEnd = svg.circle(8).fill('#000');
        wireEnd.move(beginX - 4, beginY - 4);
      })
      .mousemove(function(e) {
        if (dragging) {
          var x1 = beginX,
              y1 = beginY,
              x2 = Math.round(e.clientX / 8) * 8,
              y2 = Math.round(e.clientY / 8) * 8,
              dX = x1 - x2,
              dY = y1 - y2;

          if (!e.altKey) {
            if (Math.abs(dX) > Math.abs(dY)) {
              y2 = y1;
              dY = 0;
            } else {
              x2 = x1;
              dX = 0;
            }
          }

          wireLength = Math.sqrt(Math.pow(dX,2)+Math.pow(dY,2));
          wireCenterX = x1 - (dX / 2);
          wireCenterY = y1 - (dY / 2);
          wireAngle = Math.atan2((dY),(dX))*(180/Math.PI);
          
          wireEnd.move(x2 - 4, y2 - 4);
          
          wire.plot(beginX, beginY, x2, y2);
        }
      });

      $(document).mouseup(function(e) {
        dragging = false;
        //         wireStart.remove();
        //         wireEnd.remove();
      });
    }
  }
})
