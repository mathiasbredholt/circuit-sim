require.config({
  shim: {
    'socketio': {
      exports: 'io'
    },
  },
	baseUrl: 'js/lib',
	paths: {
    app: '../app',
    ui: '../ui',
		components: '../components',
    socketio: '/socket.io/socket.io'
	}
});

require(["app/app"], function (app) {
  app.init();
});
