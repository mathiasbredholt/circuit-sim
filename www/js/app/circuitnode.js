define(["thirdparty/jquery"], function ($) {

    function Circuitnode () {
        this.points = new Array();
		var p = this.points
        this.addPoint = function (x, y) {
			if (p.length > 0) {
				if (x != p[p.length-1][0] || y != p[p.length-1][1]) {
					p.push([x, y]);
				}
			} else {
				p.push([x, y]);
			}
        };
    }
    
    return Circuitnode;
});