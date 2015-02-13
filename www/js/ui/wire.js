 
define(function (require, exports, module) {
    'use strict';

    require('thirdparty/jquery');
    require('thirdparty/svg');

    var Circuitnode = require('app/circuitnode'),
        Terminal = require('ui/Terminal');

    var container,
        drawing,
        snap = false,
        drawMode = false,
        wireEnd,
        wire, displayWire,
        nodes = [],
        cn = new Circuitnode(),
        x1, y1, x2, y2, dx, dy;

    var svg = SVG('wiring');

    function Wire(wire, displayWire) {
        var self = this;

        self.coordinates = {
            x1: x1,
            y1: y2,
            x2: x2,
            y2: y2
        };

        wire
            .click(selectedWire)
            .keydown(function (event) {
                if (event.which === 8) {
                    event.preventDefault();
                    // removeWire();
                    wire.remove();
                    displayWire.remove();

                }
            });

        wire.mouseover(function (event) {
            if (drawMode) {
                svg.circle(8).cx(self.coordinates.x1).cy(self.coordinates.y1);
            }
        });
    }

    function init(parent) {
        container = parent;

        $("#content")
            .click(function () {
                addWire();
                nextWire();
            })
            .mousemove(function (event) {
                if (!snap && drawing) {
                    x2 = Math.round(event.clientX / 8) * 8;
                    y2 = Math.round(event.clientY / 8) * 8;

                    update();
                }
            })
            .keydown(function (event) {
                if (event.shiftKey) {
                    drawMode = true;
                }
            })
            .keyup(function (event) {
                if (event.shiftKey) {
                    drawMode = false;
                }
            });
    }

    function drawWire() {
        displayWire = svg.line(x1, y1, x1, y1)
            .attr({
                stroke: '#000',
                "stroke-width": 2,
                "stroke-linecap": 'square'
            });

        $(displayWire.node).addClass('graphics');
    }

    function addWire() {

        if (drawing) {

            // Creates the invisble wire.
            wire = svg.line(x1, y1, x2, y2)
                .attr({
                    "stroke-opacity": 0,
                    "stroke-width": 8,
                    tabindex: container.getTabIndex()
                })
                .addClass('wire');

            // Create an instance of Wire to save the wire that has been made.

            var w = new Wire($(wire.node), $(displayWire.node));

        }
    }

    function nextWire() {

        if (drawing) {

            // Resets coordinates

            x1 = x2;
            y1 = y2;

            // Draws new wire

            drawWire();

            cn.addPoint(x1, y1);


        }
    }

    function update() {

        if (drawing) {

            dx = x1 - x2;
            dy = y1 - y2;

            if (!event.altKey && !snap) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    y2 = y1;
                    dy = 0;
                } else {
                    x2 = x1;
                    dx = 0;
                }
            }

            displayWire.plot(x1, y1, x2, y2);

            wireEnd.cx(x2).cy(y2);
        }
    }

    function startWire(position) {
            $("#content").css('cursor', 'crosshair');

            x1 = Math.round(position.x / 8) * 8;
            y1 = Math.round(position.y / 8) * 8;

            cn.addPoint(x1, y1);

            drawWire();

            wireEnd = svg.circle(8).cx(x1).cy(y1);


            drawing = true;
            Terminal.snapMode(drawing);
        }
        // Ends wire, position is given with position.x and position.y

    function endWire(position, isNode) {
        addWire();

        drawing = false;

        Terminal.snapMode(drawing);

        $("#content").css('cursor', 'auto');

        wireEnd.remove();

        if (isNode) {

            Terminal.create(position, $("#circuit"), true);

        }
    }

    function selectedTerminal(position) {
        if (!drawing) {

            startWire(position);

        } else {

            snap = false;
            endWire(position, false);

        }
    }

    function selectedWire(event) {
        if (drawing) {
            $(this).blur();

            endWire({
                x: Math.round(event.clientX / 8) * 8,
                y: Math.round(event.clientY / 8) * 8
            }, true);

        }
    }


    function removeWire() {

        // wire.remove();
        // displayWire.remove();

    }

    function snapToTerminal(position) {

        if (drawing) {
            snap = true;

            x2 = position.x;
            y2 = position.y;

            update();
        }


    }

    function snapOut() {
        if (drawing) {
            snap = false;
        }
    }


    exports.init = init;
    exports.nodes = nodes;
    exports.selectedTerminal = selectedTerminal;
    exports.snapToTerminal = snapToTerminal;
    exports.snapOut = snapOut;
});
