define(function (require, exports, module) {
    "use strict";

    require("thirdparty/jquery");
    require("thirdparty/svg");

    var Server = require("server/server"),
        Terminal = require("ui/Terminal");

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

            var param, svg, svgjs, bbox;

            svg = $(img);

            // Creates component div and appends the svg
            $("#circuit").prepend(
                self.element = $("<div>")
                .addClass("component")
                .offset({
                    top: 256,
                    left: 256
                })
            );

            self.element.append($('<div>').css('display', 'inline-block').append(svg = svg));

            svgjs = SVG(svg[0]);
            bbox = {
                x: svgjs.bbox().x - 8,
                y: svgjs.bbox().y - 8,
                width: svgjs.bbox().width + 16,
                height: svgjs.bbox().height + 16
            };

            svgjs.viewbox(bbox);
            svgjs.size(bbox.width, bbox.height);


            // Create terminals on reference points

            svg.find('.ref').each(function () {
                var position = {
                    x: $(this).position().left,
                    y: $(this).position().top
                };

                Terminal.create(position, self.element.children('div'), false);
            });

            // svg.find('.terminal')
            //     .click(terminalClickHandler)
            //     .mouseover(function () {

            //         $(this).css('opacity', '1');

            //         var r = parseInt($(this).attr('rx'));

            //         self.dispatchEvent({
            //             type: 'snap',
            //             message: {
            //                 x: $(this).offset().left + r,
            //                 y: $(this).offset().top + r
            //             }
            //         });

            //     })
            //     .mouseout(function (event) {

            //         $(this).css('opacity', '0');


            //         self.dispatchEvent({
            //             type: 'snapOut',
            //             message: {}
            //         });

            //     });

            // function terminalClickHandler(event) {
            //     event.stopPropagation();
            //     var r = parseInt($(this).attr('rx'));
            //     self.dispatchEvent({
            //         type: 'terminal',
            //         message: {
            //             x: $(this).offset().left + r,
            //             y: $(this).offset().top + r
            //         }
            //     });
            // }

            // If showParameter is true, append the component value to the page.

            if (content.showParameter) {

                param = content.parameters[0];

                self.element.append($("<div>").html(param.value + " " + param.unit).addClass("componentLabel"));

            }

        }

        loadImageFromServer(content.img, function (img) {

            draw(img);

            self.element.children('div').attr("tabindex", container.getTabIndex());

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


            elem.bind('drag', function (event) {
                $(this).css({
                    top: Math.round(event.offsetY / 20) * 20,
                    left: Math.round(event.offsetX / 20) * 20
                });
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
            self.element.children('div').css('-webkit-transform', 'rotate(' + self.angle + 'deg)');

            if (self.angle > 315) {
                self.angle = 0;
            }

            if (self.angle === 90 || self.angle === 270) {
                self.element.children('.componentLabel').css({
                    "margin-left": '64px',
                    "-webkit-transform": 'translate3d(0, -' + self.element.children('svg').width() / 2 + 'px, 0)'
                });
            } else {
                self.element.children('.componentLabel').css({
                    "margin-left": '0px',
                    "-webkit-transform": 'translate3d(0, 0, 0)'
                });
            }
        };

        self.destroy = function () {
            self.element.remove();
        };
    }

    return Component;
});
