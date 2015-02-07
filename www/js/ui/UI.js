define([
	"UI/CommandPanel",
	"UI/Component",
	"UI/Marquee",
	"UI/Wire",
	"UI/Inspector"
], function(
	CommandPanel,
	Component,
	Marquee,
	Wire,
	Inspector
) {
	return {
		init: function() {
			CommandPanel.init();
			Wire.init();
			Marquee.init();
			Inspector.init();

			//Hotkeys:
			$(document).keydown(function(event) {
				if ((event.metaKey || event.ctrlKey) && event.which == 73) {
					Inspector.show();
				}

				if (event.which == 32) CommandPanel.show();
			})
		}
	}
})