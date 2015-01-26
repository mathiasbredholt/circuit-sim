define(["jquery"], function ($) {
  return {
    drawWire: function() {
      var dragging, wireStart, wireEnd, wire, beginX, beginY;
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
          .css("left", beginX)
          .css("top", beginY)
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
          var dX = beginX - e.clientX, dY = beginY - e.clientY, x, y, w, h;

          x = beginX;
          y = beginY;

          if (Math.abs(dX) > Math.abs(dY)) {
            w = Math.round(Math.abs(dX) / 8) * 8;
            h = 2;

            if (dX > 0) {
              x = beginX - w;
            }

            wire.css("left", x);
            wire.css("top", y - 1);
          }
          else {
            w = 2;
            h = Math.round(Math.abs(dY) / 8) * 8;
            if (dY > 0) {
              y = beginY - h;
            }

            wire.css("left", x - 1);
            wire.css("top", y);
          }

          wire
          .css("width", w)
          .css("height", h);

          wireEnd
          .css("left", beginX + w - 4)
          .css("top", beginY + h - 6);
        }
      });

      $(document).mouseup(function(e) {
        dragging = false;
        wireStart.remove();
        wireEnd.remove();
      });
    }
  }
})
