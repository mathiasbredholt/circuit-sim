define(["jquery"], function ($) {
  return {
    drawWire: function() {
      var dragging, wireStart, wireEnd, wire, beginX, beginY, diagonalWire, wireLength, wireCenterX, wireCenterY, wireAngle;
      var elem = $("#content");

      elem.mousedown(function(e) {
        dragging = true;
        beginX = Math.round(e.clientX / 8) * 8;
        beginY = Math.round(e.clientY / 8) * 8;

        elem.append(
          wireStart = $("<div>")
          .addClass("wireEnd")
          .css("left", beginX - 4)
          .css("top", beginY - 4)
        );

        elem.append(
          wireEnd = $("<div>")
          .addClass("wireEnd")
          .css("left", beginX - 4)
          .css("top", beginY - 4)
        );

        elem.append(
          wire = $("<div>")
          .addClass("wire")
          .css("left", beginX)
          .css("top", beginY)
        );
      });

      elem.mousemove(function(e) {
        if (dragging) {
          var
              x1 = beginX,
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

          wire
            .css("left", wireCenterX - (wireLength / 2))
            .css("top", wireCenterY)
            .css("width", wireLength)
            .css("height", 2)
            .css("transform", "rotate("+wireAngle+"deg)");

          wireEnd
          .css("left", x2 - 4)
          .css("top", y2 - 4);

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
