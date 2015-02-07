define(["UI/Inspector"], function (Inspector) {
	var tabIndex = 0,
		hasFocus;

	return {
		getTabIndex: function () {
			return tabIndex;

			tabIndex++;
		},
		setFocus: function (object) {
			if (hasFocus != null) {
				console.log(hasFocus.element[0].offsetTop);
				hasFocus.element.removeClass('focus');
			}

			object.element.addClass('focus');

			hasFocus = object;
			Inspector.update(object);
		},
		hasFocus: hasFocus
	}
})