 
define(function(require, exports, module) {
    'use strict';

    require('thirdparty/jquery');
    require('thirdparty/jquery-ui');
    require('thirdparty/svg');

    var Circuitnode = require('app/circuitnode'),
        Simulation = require('app/simulation'),
        Terminal = require('ui/Terminal');

    var container,
        drawing,
        snap = false,
        drawMode = false,
        wireEnd,
        wire, displayWire,
        nodes = [],
        cn = new Circuitnode(),
        x1, y1, x2, y2, dx, dy,
        currentPath, path;

    var svg = SVG("wiring");

    function Wire(wire, displayWire) {
        var self = this;

        self.coordinates = {
            x1: x1,
            y1: y2,
            x2: x2,
            y2: y2
        };

        $(wire.node)
            .click(selectedWire)
            .keydown(function(event) {
                if (event.which === 8) {
                    event.preventDefault();
                    // removeWire();
                    wire.remove();
                }
            });

        $(wire.node).mouseover(function(event) {
            if (drawMode) {
                svg.circle(8).cx(self.coordinates.x1).cy(self.coordinates.y1);
            }
        });

        $(wire.node).draggable({
            addClasses: false,
            grid: [16, 16]
        }).bind('drag', function(event, ui) {
            // update coordinates manually, since top/left style props don't work on SVG
            wire.move(ui.position.left, ui.position.top);
            displayWire.move(ui.position.left, ui.position.top);
        });
    }

    function init(parent) {
        container = parent;

        $("#content")
            .click(function() {
                nextWire();
            })
            .mousemove(function(event) {
                if (!snap && drawing) {
                    x2 = Math.round(event.clientX / 8) * 8;
                    y2 = Math.round(event.clientY / 8) * 8;

                    update();
                }
            })
            .keydown(function(event) {
                if (event.shiftKey) {
                    drawMode = true;
                }
            })
            .keyup(function(event) {
                if (event.shiftKey) {
                    drawMode = false;
                }
            });
    }

    function drawWire() {

        currentPath = "";

        displayWire = svg.path(path)
            .attr({
                stroke: '#000',
                "stroke-width": 2,
                "stroke-linecap": 'square'
            })
            .addClass('graphics');
    }

    function addWire() {

        if (drawing) {

            // Creates the invisble wire.
            wire = svg.path(path)
                .attr({
                    "stroke-opacity": 0,
                    "stroke-width": 8,
                    "fill": "none",
                    tabindex: container.getTabIndex()
                })
                .addClass('wire');
        }
    }

    function nextWire() {

        if (drawing) {

            // Resets coordinates

            path = path + currentPath;

            x1 = x2;
            y1 = y2;

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

            currentPath = "M" + x1 + " " + y1 + "L" + x2 + " " + y2;
            displayWire.plot(path + currentPath);

            wireEnd.cx(x2).cy(y2);
        }
    }

    function startWire(position) {
            $("#content").css('cursor', 'crosshair');

            path = "";

            x1 = Math.round(position.x / 8) * 8;
            y1 = Math.round(position.y / 8) * 8;

            cn.addPoint(x1, y1);

            drawWire();

            wireEnd = svg.circle(8).cx(x1).cy(y1).addClass('graphics');

            drawing = true;
            Terminal.snapMode(drawing);
        }
        // Ends wire, position is given with position.x and position.y

    function endWire(position, isNode) {
        addWire();
        // Create an instance of Wire to save the wire that has been made.
        var w = new Wire(wire, displayWire);

        drawing = false;

        Terminal.snapMode(drawing);

        $("#content").css('cursor', 'auto');

        wireEnd.remove();

        if (isNode) {

            Terminal.create(position, $("#circuit"), true);

        }

        cn.addPoint(Math.round(position.x / 8) * 8, Math.round(position.y / 8) * 8);
        nodes.push(cn); //When the wire is complete, add the current node to the list of nodes
        nodes = Simulation.minimizeNodes(nodes);
        cn = new Circuitnode();
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
        console.log(event);

        if (drawing) {

            $(event.target).blur();

            endWire({
                x: x2,
                y: y2
            }, true);

        }
    }


    function removeWire() {
        wire.remove();
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
