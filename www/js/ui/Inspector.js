/*global define*/
define(function (require, exports, module) {
	"use strict";
	
	require("thirdparty/jquery");
	
	return {
		init: function () {
			$("#inspector > .inspectorTitle").html("Nothing to inspect...");
		},
		show: function () {
			$("#inspector").toggle();
		},
		update: function (object) {
			$("#inspector > .inspectorTitle").html(object.name);
		}
	};
});