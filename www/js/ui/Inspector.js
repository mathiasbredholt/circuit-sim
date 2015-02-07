/*global define, $*/
define(function (require, exports, module) {
	"use strict";

	require("thirdparty/jquery");

	function init() {
		$("#inspector > .inspectorTitle").html("Nothing to inspect...");
	}

	function show() {
		$("#inspector").toggle();
	}

	function update(obj) {
		$("#inspector > .inspectorTitle").html(obj.name);
	}

	exports.init = init;
	exports.show = show;
	exports.update = update;
});