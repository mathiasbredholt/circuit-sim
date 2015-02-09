define(function (require, exports, module) {
    "use strict";

    require("thirdparty/jquery");
    require("thirdparty/snap.svg");
    require("thirdparty/EventDispatcher");


    var Server = require("server/server");

    function drawComponent(content, img) {

    }

    function loadImageFromServer(url, onImageReceived) {
        Server.send("getImg", url);
        Server.on("rcvImg", function (data) {
            Server.remove("rcvImg");
            onImageReceived(data);
        });
    }

    function Component(content, container) {
        var self = this;

        self.hasFocus = false;
        self.angle = 0;

        self.name = content.name;
        self.parameters = content.parameters;

        // Draw component function

        function draw(img) {

            var param, svg;

            svg = $(img);

            // Creates component div and appends the svg

            $("#content").append(
                self.element = $("<div>")
                .addClass("component")
                .offset({
                    top: 256,
                    left: 256
                })
                .append(svg)
            );

            // Create terminals

            for (var i = 0; i < content.terminals.length; i++) {
                self.element.append(
                    $("<div>")
                    .addClass('terminal')
                    .css({
                        "left": content.terminals[i].x - 4,
                        "top": content.terminals[i].y - 4
                    })
                    .click(terminalClickHandler)
                );
            }

            function terminalClickHandler(event) {
                self.dispatchEvent({
                    type: 'terminal',
                    message: {
                        x: $(this).offset().left,
                        y: $(this).offset().top
                    }
                });
            }

            // If showParameter is true, append the component value to the page.

            if (content.showParameter) {

                param = content.parameters[0];

                self.element.append($("<div>").html(param.value + " " + param.unit).addClass("componentLabel"));

            }

        }

        loadImageFromServer(content.img, function (img) {


            draw(img);

            self.element.attr("tabindex", container.getTabIndex());

            var dragging,
                origin = {
                    left: 0,
                    top: 0
                },
                elem = self.element;

            elem.mousedown(function (e) {
                dragging = true;

                origin.left = e.clientX - elem.offset().left;
                origin.top = e.clientY - elem.offset().top;

                //              container.setFocus(focusHandler);
            })
                .focus(function () {
                    self.hasFocus = true;
                    container.setFocus(self);
                })
                .blur(function () {
                    self.hasFocus = false;
                });

            $(document)
                .mouseup(function () {
                    dragging = false;
                })
                .mousemove(function (e) {
                    if (dragging) {
                        elem.offset({
                            left: Math.round((e.clientX - origin.left) / 8) * 8,
                            top: Math.round((e.clientY - origin.top) / 8) * 8
                        });
                    }
                });

            self.element.keydown(function (event) {
                if (event.which === 8) {
                    event.preventDefault();
                    elem.blur();
                    elem.remove();
                }

                if (event.which === 82 && event.shiftKey) {
                    self.rotate();
                }
            });
        });

        self.rotate = function () {
            self.angle += 45;
            self.element.children('svg').css('-webkit-transform', 'rotate(' + self.angle + 'deg)');

            if (self.angle > 315) {
                self.angle = 0;
            }

            if (self.angle === 90 || self.angle === 270) {
                self.element.children('div').css({
                    "margin-left": '32px',
                    "-webkit-transform": 'translate3d(0, -22px, 0)'
                });
            } else {
                self.element.children('div').css({
                    "margin-left": '0px',
                    "-webkit-transform": 'translate3d(0, 0, 0)'
                });
            }
        };

        self.destroy = function () {
            self.element.remove();
        };
    }

    EventDispatcher.prototype.apply(Component.prototype);

    return Component;
});