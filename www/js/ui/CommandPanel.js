/*jslint plusplus: true */
/*global define, $*/
define(function (require, exports, module) {
	"use strict";

	require("thirdparty/jquery");

	var Command = require("app/command"),
		Server = require("server/server");

	var hasFocus = false,
		selectedIndex = 0,
		numberOfItems = 0,
		result,
		display = false,
		elem,
		ui;

	function selectItem(index) {
		$("#searchResult li").removeClass("hover");
		$("#searchResult li:eq(" + index + ")").addClass("hover");
	}

	function selectNextItem() {
		var selected = $("#searchResult").find(".hover");
		if (selectedIndex < numberOfItems - 1) {
			selectedIndex++;
		} else {
			selectedIndex = 0;
		}
		selectItem(selectedIndex);
	}

	function selectPrevItem() {
		var selected = $("#searchResult").find(".hover");
		if (selectedIndex > 0) {
			selectedIndex--;
		} else {
			selectedIndex = numberOfItems - 1;
		}
		selectItem(selectedIndex);
	}

	function select() {
		Command.run(result[selectedIndex]);
	}

	function listItemHover() {
		selectedIndex = elem.index();
		selectItem(selectedIndex);
	}

	function updateList() {
		var results = $("#searchResult"),
			i;
		numberOfItems = result.length;
		results.empty();
		for (i = 0; i < numberOfItems; i++) {
			elem = $("<li>")
				.addClass("commandItem")
				.html(result[i].title)
				.mouseover(listItemHover)
				.click(select);
			elem.append(
				$("<span>").addClass("commandType").html(result[i].type)
			);

			if (i === selectedIndex) {
				elem.addClass("hover");
			}

			results.append(elem);
		}
		if (selectedIndex > numberOfItems) {
			selectedIndex = numberOfItems - 1;
			selectItem(selectedIndex);
		}
	}

	function show() {
		display = !display;
		if (display) {
			$("#commandpanel").one("webkitTransitionEnd", function () {
				$("#commandInput")[0].focus();
				$("#commandInput")[0].select();
			});
		} else {
			$("#commandInput")[0].blur();
		}

		$("#commandpanel").toggleClass("slide");
	}

	function init(container) {
		var lastInput = "";


		Server.on("searchResult", function (data) {
			result = data;
			updateList();
		});

		$("#commandInput").keyup(function (e) {
			var input = $(this).val();
			if (input !== lastInput) {
				lastInput = input;
				//          UpdateList();
				Server.send("search", input);
			}
		});

		$("#commandInput")
			.focus(function () {
				hasFocus = true;
			})
			.blur(function () {
				hasFocus = false;
			});

		$(document).keydown(function (event) {
			if (event.which === 32) {
				show();
			}

			if (hasFocus) {
				if (event.which === 38) {
					event.preventDefault();
					selectPrevItem();
				}

				if (event.which === 40) {
					event.preventDefault();
					selectNextItem();
				}

				if (event.which === 13) {
					select();
				}
			}
		});
	}

	exports.init = init;
});