/*jslint plusplus: true */
/*global define*/
define(["jquery", "server/server", "app/command"], function ($, Server, Command) {
	'use strict';
	var selectedIndex = 0,
		numberOfItems = 0,
		result,
		display = false,
		i,
		elem;

	function selectItem(index) {
		$("#searchResult li").removeClass("hover");
		$("#searchResult li:eq(" + index + ")").addClass("hover");
	}

	function selectNextItem() {
		if (selectedIndex < numberOfItems - 1) {
			selectedIndex++;
		} else {
			selectedIndex = 0;
		}
		selectItem(selectedIndex);
	}

	function selectPrevItem() {
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
		numberOfItems = result.length;

		var results = $("#searchResult");
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

	return {
		init: function () {
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
			$(document).keydown(function (e) {
				var selected = $("#searchResult").find(".hover");

				if (e.which === 38) {
					e.preventDefault();
					selectPrevItem();
				}

				if (e.which === 40) {
					e.preventDefault();
					selectNextItem();
				}

				if (e.which === 13) {
					e.preventDefault();
					select();
				}
			});

		},
		show: function () {
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
	};
});