/*global define, $*/
define(["thirdparty/jquery"], function ($) {

    function CircuitNode() {
        this.points = [];
        var p = this.points;
        this.addPoint = function (x, y) {
            if (p.length > 0) {
                if (x != p[p.length - 1][0] || y != p[p.length - 1][1]) {
                    p.push([x, y]);
                }
            } else {
                p.push([x, y]);
            }
        };
        this.mergeNode = function (points) {
            for (var i = 0; i < points.length; i++) {
                p.push(points[i]);
            }
        };
    }

    return CircuitNode;
});
