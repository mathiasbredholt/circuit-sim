define(function (require, exports, module) {
    "use strict";

    var CircuitNode = require("app/circuitnode"),
        Wire = require("ui/wire");

    function minimizeNodes(nodes) {
        //var wn = Wire.nodes;
        for (var i = 0; i < nodes.length; i++) {
            for (var j = 0; j < nodes[i].points.length; j++) {
                for (var k = i + 1; k < nodes.length; k++) {
                    for (var l = 0; l < nodes[k].points.length; l++) {
                        if (nodes[i].points[j][0] == nodes[k].points[l][0] && nodes[i].points[j][1] == nodes[k].points[l][1]) {
                            nodes[i].mergeNode(nodes[k]);
                            nodes.splice(k, 1);
                            break;
                        }
                    }
                }
            }
        }
        return nodes;
    }

    exports.minimizeNodes = minimizeNodes;

});
