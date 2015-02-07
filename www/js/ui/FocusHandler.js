/*jslint plusplus: true */
/*global define*/
define(function (require, exports, module) {
	"use strict";
	
	var Inspector = require("ui/Inspector");
	
	var hasFocus;
	
	function setFocus(object) {
		if (hasFocus != null) {
			hasFocus.element.removeClass('focus');
		}

		object.element.addClass('focus');

		hasFocus = object;
		Inspector.update(object);
	}
	
	exports.setFocus = setFocus;
});