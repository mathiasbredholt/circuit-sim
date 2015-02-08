/*jslint plusplus: true */
/*global define, $*/
define(function (require, exports, module) {
	"use strict";

	require("thirdparty/jquery");

	var isOpen = false,
		hasFocus;

	function open() {
		isOpen = true;
		$("#inspector").removeClass("inspectorHide");
		$("#inspector").addClass("inspectorShow");
	}

	function close() {
		isOpen = false;
		$("#inspector").removeClass("inspectorShow");
		$("#inspector").addClass("inspectorHide");
	}

	function toggle() {
		isOpen = !isOpen;
		$("#inspector").toggleClass("inspectorShow inspectorHide");
	}

	function saveChanges(event) {
		hasFocus.parameters[0].value = event.target.value;
	}

	function update(obj) {
		var i, param;

		hasFocus = obj;

		$("#inspector > .inspectorTitle").html(obj.name);

		for (i = 0; i < obj.parameters.length; i++) {
			param = obj.parameters[i];
			$("#inspector > .inspectorParam").html(param.name);
			$("#inspector > .inspectorParamInput").val(param.value).change(saveChanges);
			$("#inspector > .inspectorParamUnit").html(param.unit);
		}
	}

	function init() {
		$("#inspector > .inspectorTitle").html("Nothing to inspect...");

		$("#inspectorCloseButton").click(close);
	}

	exports.open = open;
	exports.close = close;
	exports.toggle = toggle;
	exports.update = update;
	exports.init = init;
});