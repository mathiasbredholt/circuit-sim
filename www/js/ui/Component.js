/*jslint plusplus: true */
/*global define, $*/
define(function (require, exports, module) {
	"use strict";

	require("thirdparty/jquery");

	var Server = require("server/server"),
		FocusHandler = require("ui/FocusHandler");

	function drawComponent(content, img) {
		var param, elem = $("<div>")
			.html(img)
			.addClass("component")
			.offset({
				top: 256,
				left: 256
			});

		if (content.name === "Resistor" || content.name === "Capacitor" || content.name === "Voltage Supply") {
			param = content.parameters[0];
			elem.append($("<div>").html(param.value + param.unit).addClass("componentLabel"));
		}

		$("#content").append(elem);
		return elem;
	}

	function configureHandlers(obj) {
		var dragging,
			origin = {
				left: 0,
				top: 0
			},
			elem = obj.element;

		elem.mousedown(function (e) {

			dragging = true;

			origin.left = e.clientX - elem.offset().left;
			origin.top = e.clientY - elem.offset().top;

			FocusHandler.setFocus(obj);

		});
		$(document)
			.mouseup(function () {
				dragging = false;
			})
			.mousemove(function (e) {
				if (dragging) {
					elem.offset({
						left: Math.round((e.clientX - origin.left) / 8) * 8,
						top: Math.round((e.clientY - origin.top) / 8) * 8
					});
				}
			});
	}

	function loadImageFromServer(url, onImageReceived) {
		Server.send("getImg", url);
		Server.on("rcvImg", function (data) {
			Server.remove("rcvImg");
			onImageReceived(data);
		});
	}

	function Component(content) {
		var self = this;

		self.name = content.name;
		self.parameters = content.parameters;

		loadImageFromServer(content.img, function (img) {
			self.element = drawComponent(content, img);
			configureHandlers(self);
		});
	}

	return Component;
});