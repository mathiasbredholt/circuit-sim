/*jslint plusplus: true */
/*global define, $*/
define(function (require, exports, module) {
	"use strict";

	require("thirdparty/jquery");

	var Server = require("server/server"),
		FocusHandler = require("ui/FocusHandler");

	function drawComponent(img, self) {
		var elem = $("<div>")
			.html(img)
			.addClass("component")
			.offset({
				top: 64,
				left: 64
			});
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

	function Component(cmd) {
		var self = this;

		self.name = cmd.name;

		loadImageFromServer(cmd.img, function (img) {
			self.element = drawComponent(img);
			configureHandlers(self);
		});
	}

	return Component;
});