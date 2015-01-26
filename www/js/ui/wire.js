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
          var
          x = beginX,
              y = beginY,
              dX = beginX - Math.round(e.clientX / 8) * 8,
              dY = beginY - Math.round(e.clientY / 8) * 8,
              w, h, dW, dH;

          if (Math.abs(dX) > Math.abs(dY)) {
            w = Math.abs(dX);
            h = 0;
            dW = w;
            dH = h;

            if (dX > 0) {
              x = beginX - w;
              dW = 0;
            }

            wire
            .css("left", x)
            .css("top", y - 1)
            .css("width", w)
            .css("height", h + 2);


          }
          else {
            w = 0;
            h = Math.abs(dY);
            dW = w;
            dH = h;

            if (dY > 0) {
              y = beginY - h;
              dH = 0;
            }

            wire
            .css("left", x - 1)
            .css("top", y)
            .css("width", w + 2)
            .css("height", h)
          }

          wireEnd
          .css("left", x + dW - 4)
          .css("top", y + dH - 4);

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
