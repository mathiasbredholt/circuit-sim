/*jslint plusplus: true */
/*global define*/
define(["jquery", "server/server", "UI/FocusHandler"], function ($, Server, FocusHandler) {
	'use strict';
	function Component() {
		this.draw = function () {
		}
	}
	return {
		create: function (cmd) {
			var dragging = false,
				origin = {
					left: 0,
					top: 0
				},
				elem,
				component = new Component();
			Server.send("getImg", cmd.img);
			Server.on("rcvImg", function (data) {
				Server.remove("rcvImg");
				elem = $("<div>")
					.html(data)
					.addClass("component")
					.offset({
						top: 64,
						left: 64
					})
					.mousedown(function (e) {
						dragging = true;
						origin.left = e.clientX - elem.offset().left;
						origin.top = e.clientY - elem.offset().top;
						FocusHandler.setFocus();
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
				$("#content").append(elem);
			});
		}
	};
});