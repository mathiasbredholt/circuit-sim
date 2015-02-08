/*jslint plusplus: true */
/*global define, $*/
define(function (require, exports, module) {
	"use strict";

	require("thirdparty/jquery");

	var Component = require("ui/Component");

	function run(cmd) {
		switch (cmd.cmd) {
		case "toggle_grid":
			$("#grid").toggle();
			break;
		case "add_component":
			var component = new Component(cmd.content);
			break;
		}
	}

	exports.run = run;
});