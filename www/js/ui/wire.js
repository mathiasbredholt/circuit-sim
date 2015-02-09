define(function (require, exports, module) {
    'use strict';

    require('thirdparty/jquery');
    require('thirdparty/snap.svg');

    var Circuitnode = require('app/circuitnode');

    var dragging,
        wireStart,
        wireEnd,
        wire,
        nodes = [],
        cn = new Circuitnode(),
        x1, y1, x2, y2, dx, dy;

    var s = Snap('#wiring');

    function init() {
        $('#wiring')
            .click(function (e) {
                if (dragging) {
                    x1 = x2;
                    y1 = y2;

                    wire = s.line(x1, y1, x1, y1)
                        .attr({
                            strokeWidth: 2,
                            stroke: 'black',
                            strokeLinecap: 'round'
                        });

                    cn.addPoint(x1, y1);
                    //          wireStart = s.circle(x1, y1, 4);
                    //          wireEnd = s.circle(x1, y1, 4);
                }
            })
            .mousemove(function (e) {
                if (dragging) {
                    x2 = Math.round(e.clientX / 8) * 8;
                    y2 = Math.round(e.clientY / 8) * 8;
                    dx = x1 - x2;
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

                    wire.attr({
                        'x2': x2,
                        'y2': y2
                    });
                    //          wireEnd.attr({ 'cx': x2, 'cy': y2 });
                }
            });
    }

    function drawWire(position) {
        dragging = !dragging;
        x1 = Math.round(position.x / 8) * 8;
        y1 = Math.round(position.y / 8) * 8;

        cn.addPoint(x1, y1);

        if (dragging) {
            wire = s.line(x1, y1, x1, y1)
                .attr({
                    strokeWidth: 2,
                    stroke: 'black',
                    strokeLinecap: 'round'
                });

            //          wireStart = s.circle(x1, y1, 4);
            //          wireEnd = s.circle(x1, y1, 4);
        } else {
            nodes.push(cn); //When the wire is complete, add the current node to the list of nodes
            cn = new Circuitnode();
        }

    }

    exports.nodes = nodes;
    exports.init = init;
    exports.drawWire = drawWire;
});