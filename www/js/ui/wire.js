 
define(function (require, exports, module) {
    'use strict';

    require('thirdparty/jquery');
    require('thirdparty/svg');

    var Circuitnode = require('app/circuitnode');

    var container,
        drawing,
        drawMode = false,
        wireEnd,
        wire, displayWire,
        nodes = [],
        cn = new Circuitnode(),
        x1, y1, x2, y2, dx, dy;

    var svg = SVG('wiring');

    function Wire(wire, displayWire) {
        var self = this;

        wire
            .click(selectedWire)
            .keydown(function (event) {
                if (event.which === 8) {
                    event.preventDefault();
                    wire.remove();
                    displayWire.remove();
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
            .mousemove(update)
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
                "stroke-linecap": 'round'
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

            x2 = Math.round(event.clientX / 8) * 8;
            y2 = Math.round(event.clientY / 8) * 8;

            dx = x1 - x2;
            dy = y1 - y2;

            if (!event.altKey) {
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
        drawing = true;

        x1 = Math.round(position.x / 8) * 8;
        y1 = Math.round(position.y / 8) * 8;

        cn.addPoint(x1, y1);

        drawWire();

        wireEnd = svg.circle(8).cx(x1).cy(y1);
    }

    function selectedTerminal(position) {
        if (!drawing) {

            startWire(position);

        } else {

            endWire({}, false);

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

    // Ends wire, position is given with position.x and position.y

    function endWire(position, isNode) {
        addWire();

        drawing = false;

        if (!isNode) {

            $(wireEnd.node).remove();

        }
    }

    exports.nodes = nodes;
    exports.init = init;
    exports.selectedTerminal = selectedTerminal;
});
