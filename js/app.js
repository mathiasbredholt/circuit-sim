requirejs.config({
	baseUrl: 'js/lib',
	paths: {
		components: '../components'
	}
});

require(["jquery"], function(resistor) {
  var canvas = $("#grid")[0];
  var ctx = canvas.getContext("2d");


});
