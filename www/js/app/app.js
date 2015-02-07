define(["jquery", "server/server", "UI/UI"], function ($, Server, UI) {
	return {
		init: function () {
			Server.connect();
			UI.init();
		}
	}
});