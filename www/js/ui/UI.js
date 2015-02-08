/*globals define, $*/
define(function (require, exports, module) {
	"use strict";

	require("thirdparty/jquery");

	var CommandPanel = require("ui/CommandPanel"),
		Wire = require("ui/Wire"),
		Marquee = require("ui/Marquee"),
		Inspector = require("ui/Inspector");

	function init() {
		CommandPanel.init();
		Wire.init();
		Marquee.init();
		Inspector.init();

		//Hotkeys:
		$(document).keydown(function (event) {
			if ((event.metaKey || event.ctrlKey) && event.which === 73) {
				Inspector.toggle();
			}

			if (event.which === 32) {
				CommandPanel.show();
			}
		});
	}

	exports.init = init;
});