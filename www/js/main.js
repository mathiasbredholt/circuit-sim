require.config({
  shim: {
    'socketio': {
      exports: 'io'
    },
    'svgjs': {
      exports: 'SVG'
    }
  },
	paths: {
    "jquery": 'https://code.jquery.com/jquery-2.1.3.min',
    "underscore": 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min',
    "svgjs": 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/1.0.1/svg.min',
    app: 'app',
    ui: 'ui',
		components: 'components',
    server: 'server',
    socketio: '/socket.io/socket.io'
	}
});

require(["app/app"], function (app) {
  app.init();

//   document.oncontextmenu = function(e) {
//     e.preventDefault();
//   }
});
