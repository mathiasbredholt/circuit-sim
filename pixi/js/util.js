var Util = (function() {
	
	var formatStr = function() {
	    var str = arguments[0];
	    for (var i = 1; i < arguments.length; i++) {
	        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
	        str = str.replace(regEx, arguments[i]);
	    }
	    
	    return str;
	};

	var snap = function(x, gridSize) {
		return Math.round((x)/gridSize)*gridSize;
	};

	return {
		formatStr: formatStr,
		snap: snap
	};
})();