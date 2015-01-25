require.config({
	baseUrl: 'js/lib',
	paths: {
    app: '../app',
    ui: '../ui',
		components: '../components'
	}
});

require(["app/app"], function (app) {
  app.init();
});
