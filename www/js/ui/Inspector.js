/*global define*/
define(["jquery"], function ($) {
	'use strict';
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