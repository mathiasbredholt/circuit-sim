/*global require*/
require.config({
	shim: {
		"socketio": {
			exports: "io"
		},
		"snap.svg": {
			exports: "Snap"
		},
		"jquery": {
			exports: "$"
		}
	},
	paths: {
		app: "app",
		ui: "ui",
		server: "server",
		socketio: "/socket.io/socket.io",
		thirdparty: "thirdparty"
	}
});

require(["app/app"], function (app) {
	"use strict";
	app.init();

	//   document.oncontextmenu = function(e) {
	//     e.preventDefault();
	//   }
});