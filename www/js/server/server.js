define(["socketio"], function (io) {
	var socket;
	return {
		connect: function () {
			socket = io();
		},
		send: function (msg, data) {
			socket.emit(msg, data);
		},
		on: function (msg, handler) {
			socket.on(msg, handler);
		},
		remove: function (msg) {
			socket.removeListener(msg);
		}
	}
})