require.config({
  shim: {
    'socketio': {
      exports: 'io'
    },
  },
	baseUrl: 'js/lib',
	paths: {
    "jquery": 'https://code.jquery.com/jquery-2.1.3.min',
    "underscore": 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min',
    app: '../app',
    ui: '../ui',
		components: '../components',
    socketio: '/socket.io/socket.io'
	}
});

require(["app/app"], function (app) {
  app.init();
});
