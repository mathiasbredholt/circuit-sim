define(["jquery", "UI/Component"], function ($, Component) {
	return {
		run: function (cmd) {
			switch (cmd.cmd) {
			case "toggle_grid":
				$("#grid").toggle();
				break;
			case "add_component":
				Component.create(cmd);
				break;
			}
		}
	}
})