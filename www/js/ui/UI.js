/*globals define, $*/
define(function (require, exports, module) {
	"use strict";

	require("thirdparty/jquery");

	var CommandPanel = require("ui/CommandPanel"),
		Wire = require("ui/Wire"),
		Marquee = require("ui/Marquee"),
		Inspector = require("ui/Inspector");

	var tabIndex = 0,
		hasFocus = null;

	var container = {
		setFocus: function (obj) {
			Inspector.update(obj);
		},
		getTabIndex: function () {
			return tabIndex++;
		}
	}

	function init() {

		CommandPanel.init(container);
		Wire.init();
		Marquee.init();
		Inspector.init();

		//Hotkeys:
		$(document).keydown(function (event) {
			if ((event.metaKey || event.ctrlKey) && event.which === 73) {
				Inspector.toggle();
			}
		});
	}

	exports.init = init;
	exports.container = container;
});