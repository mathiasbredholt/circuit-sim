// CIRCUIT MODULE

var Circuit = (function() {
	var wires = [];
	var components = [];
	var connections = [];

	function findConnections(node) {
		var res  = _.filter(connections, function(obj) {
			return _.isEqual(obj[0], node) || _.isEqual(obj[1], node);
		});
		return res;

		// var node = wires[0][0];

		// console.log('from: '+node);

		// function check(i) {
		// 	if (_.isEqual(wires[i][0], node) || _.isEqual(wires[i][1], node)) {
		// 		return true;
		// 	}
		// 	return false;
		// }

		// for (var i = 0; i < wires.length; i++) {
		// 	if (!check(i)) break;
		// 	node = wires[i][1];
		// }

		// console.log('to: '+node);

		// for(var i = 0; _.contains(wires[i], node); i++) {
		// 	node = wires[i].from;
		// }
		// console.log(i);
		// console.log(node);
	}

	var addWire = function(start, end) {
		wires.push([start, end]);
	};

	var addComponent = function(component) {
		components.push(component);
		document.getElementById('components').innerHTML += Util.formatStr('<p>{0}, {1}</p>',
			component.type, 
			component.terminals
		);


		// if (component.type == 'resistor') {
		// 	var G = 1/1000;
		// 	var stamp = [ 	[ G, -G ],
		// 				 	[ -G, G ]	];
		// }
		// else if (component.type == 'gnd') {
		// }
	};

	var addConnection = function(from, to) {
		connections.push([ from, to ]);
		document.getElementById('connections').innerHTML += Util.formatStr('<p>({0}, {1}) -> ({2},{3})</p>', from[0], from[1], to[0], to[1]);
	};

	var simulate = function() {
		var gnd = _.where(components, { type: 'gnd' });
		var voltage = _.where(components, { type: 'voltage' });
		var resistors = _.where(components, { type: 'resistor' });

		if (gnd[0] !== null) {
			// var gndNode = findConnections(gnd[0].terminals[0]);
			// var voltageNode = findConnections(voltage[0].terminals[1]);

			// following algorithm http://qucs.sourceforge.net/tech/node14.html
			// Vs = 5 V
			// R = 1 k
			var Vs = 5;
			var R = 1000;

			var A = [	[ 1/R, 1 ],
						[ 1	,	0 ]],
				z = [ 0, Vs ];
			var res = numeric.dot(numeric.inv(A),z);
			document.getElementById('results').innerHTML  = Util.formatStr('<p>Vs: {0} V</p><p>I: {1} A</p>', res[0], res[1]);
		}
		else {
			alert('There is no GND!!');
		}
	};

	return {
		addWire: addWire,
		addComponent: addComponent,
		addConnection: addConnection,
		simulate: simulate
	};
})();