/*jslint plusplus: true */
/*global define, $*/
define(function (require, exports, module) {
	"use strict";

	require("thirdparty/jquery");

	var Server = require("server/server");

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
			elem.append($("<div>").html(param.value + " " + param.unit).addClass("componentLabel"));
		}

		$("#content").append(elem);
		return elem;
	}

	function loadImageFromServer(url, onImageReceived) {
		Server.send("getImg", url);
		Server.on("rcvImg", function (data) {
			Server.remove("rcvImg");
			onImageReceived(data);
		});
	}

	function Component(content, container) {
		var self = this;

		self.hasFocus = false;

		self.name = content.name;
		self.parameters = content.parameters;

		loadImageFromServer(content.img, function (img) {
			self.element = drawComponent(content, img);
			self.element.attr("tabindex", container.getTabIndex());

			var dragging,
				origin = {
					left: 0,
					top: 0
				},
				elem = self.element;

			elem.mousedown(function (e) {
					dragging = true;

					origin.left = e.clientX - elem.offset().left;
					origin.top = e.clientY - elem.offset().top;

					//				container.setFocus(focusHandler);
				})
				.focus(function () {
					self.hasFocus = true;
					container.setFocus(self);
				})
				.blur(function () {
					self.hasFocus = false;
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
				})
				.keydown(function (event) {
					if (self.hasFocus) {

						if (event.which === 8) {
							event.preventDefault();
							elem.blur();
							elem.remove();
						}

						if (event.which === 82) {
							self.rotate();
						}

					}
				});
		});

		self.rotate = function () {
			self.element.css("-webkit-transform: rotate3d(90, 0, 0)");
		}

		self.destroy = function () {
			self.element.remove();
		};
	}

	return Component;
});