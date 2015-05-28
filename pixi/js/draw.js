var GRID_SIZE = 8;

var renderer = new PIXI.CanvasRenderer(
    800,
    600,
    {
    	view: document.getElementById("content"),
    	transparent: true,
    	antialias: true
    }
  );

var container = new PIXI.Container(); // main

// create background for catching mouse events
var background = new PIXI.Graphics();
background.beginFill(0x000000, 0.0);
background.drawRect(0, 0, 800, 600);
background.endFill();
background.interactive = true;
container.addChild(background);
container.interactive = true;
renderer.render(container);

var wire, drawMode = false, diagonal = false;
var x1, x2, y1, y2, fromX, fromY;

var wireMode = false, 
	snapMode = false, 
	moveMode = false,
	scaleMode = false,
	_moveX,
	_moveY,
	_scaleX,
	_scaleY,
	_parent,
	_target,
	_bbox;
var blur = function() {};


background.mousedown = function(event) {
	// focus handler
	blur();
	blur = function() {};
	update();

	if (drawMode) {
		resetWire();
		x1 = x2;
		y1 = y2;
		beginWire();
	}
};

function drawJunction(x, y, rad, parent) {
	var junction = new PIXI.Graphics();
	junction.beginFill(0x000000);
	junction.drawCircle(0, 0, 4);
	junction.endFill();
	junction.hitArea = new PIXI.Circle(0, 0, rad);
	junction.position.x = x;
	junction.position.y = y;
	junction.interactive = true;

	var area = new PIXI.Graphics();
	area.beginFill(0x0000FF, 0.25);
	area.drawCircle(0, 0, 32);
	area.endFill();
	junction.addChildAt(area, 0);
	junction.mousedown = function(event) {// begin or end wire drawing
		// focus handler
		blur();
		blur = function() {};
		update();

		event.stopPropagation();

		drawMode = !drawMode;
		
		if (!drawMode) {
			x2 = parent.position.x + junction.position.x;
			y2 = parent.position.y + junction.position.y;
			resetWire();
			Circuit.addConnection([startX, startY], [x2 / GRID_SIZE, y2 / GRID_SIZE]);
		}
		
		if (drawMode) {
			x1 = parent.position.x + junction.position.x;
			y1 = parent.position.y + junction.position.y;
			startX = x1 / GRID_SIZE;
			startY = y1 / GRID_SIZE;
			beginWire();
		}
	};
	junction.mouseover = function() {
		if (drawMode) {
			snapMode = true;
			wireMode = true;
			x2 = parent.position.x + junction.position.x;
			y2 = parent.position.y + junction.position.y;
			update();
		}
	};
	junction.mouseout = function() {
		if (drawMode) {
			snapMode = false;
			wireMode = true;
			update();
		}
	};
	parent.addChild(junction);
	update();
}

function beginWire() {
	wire = new PIXI.Graphics();
	wire.position.x = x1;
	wire.position.y = y1;
	container.addChildAt(wire, 1);
	update();
	document.onmousemove = function(event) {
		diagonal = event.altKey;
		if (wireMode) update();
		if (drawMode) {
			wireMode = true;
			if (!snapMode) {
				x2 = Util.snap(event.clientX, GRID_SIZE);
				y2 = Util.snap(event.clientY, GRID_SIZE);
			}	
		}	
	};
}

function resetWire() {
	update();

	// debug area
	var area = new PIXI.Graphics();
	area.beginFill(0xFF0000, 0.5);
	area.drawPolygon(calculateBounds());
	area.endFill();
	wire.addChildAt(area, 0);
	update();


	// junctions on wires

	// wire.hitArea =  new PIXI.Polygon(calculateBounds());
	// wire.interactive = true;
	// wire.mousedown = function(event) {
	// 	event.stopPropagation();
	// 	resetWire();
	// 	drawMode = !drawMode;
	// 	drawJunction(x2, y2, 32, event.target);
	// };
	// wire.mouseover = function(event) {
	// 	// !!! CHANGE !!! need to snap to intersection instead of start position
	// 	if (drawMode) {
	// 		snapMode = true;
	// 		wireMode = true;
	// 		x2 = event.target.position.x;
	// 		y2 = event.target.position.y;
	// 		update();
	// 	}
	// };
	// wire.mouseout = function() {
	// 	if (drawMode) {
	// 		snapMode = false;
	// 		wireMode = true;
	// 		update();
	// 	}
	// };

	Circuit.addWire([x1 / GRID_SIZE, y1 / GRID_SIZE ],  [x2 / GRID_SIZE, y2 / GRID_SIZE ]);
}

function calculateBounds() { // calculates bounds for the snap area of the wires
	var width = 16;
		var dx = x2 - x1;
		var dy = y2 - y1;
		var len = Math.sqrt(dx*dx+dy*dy);

		var vec = [-(width/2)*dy/len,(width/2)*dx/len];

		var p1 = [vec[0], vec[1]];
		var p2 = [-vec[0], -vec[1]];
		var p3 = [(x2 - x1) - vec[0], (y2 - y1) - vec[1]];
		var p4 = [(x2 - x1) + vec[0], (y2 - y1) + vec[1]];

		return [ p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], p4[0], p4[1] ];
}

// !!! CHANGE !!! gets the terminal object from server

// --- COMPONENT DRAWING ---
var posX = 16, posY = 16;
term = [ { x: 32, y: 64, r: 32 }, { x: 96, y: 64, r: 32 } ];

drawComponent(posX, posY, 'img/resistor.svg', term);

Circuit.addComponent({
	type: 'resistor',
	position: { x: posX, y: posY },
	terminals: _.map(term, function(obj) { 
		return [ obj.x / GRID_SIZE + posX, obj.y / GRID_SIZE + posY ];
	})
});

// posX = 32;
// posY = 32;
// term = [ { x: 0, y: 32, r : 32 }, { x: 64, y: 32, r: 32 } ];

// drawComponent(posX, posY, 'img/capacitor.svg', term);

// Circuit.addComponent({
// 	type: 'capacitor',
// 	position: { x: posX, y: posY },
// 	terminals: _.map(term, function(obj) { 
// 		return [ obj.x / GRID_SIZE + posX, obj.y / GRID_SIZE + posY ]; 
// 	})
// });

posX = 48;
posY = 48;
term = [ { x: 0, y: 32, r : 32 }, { x: 64, y: 32, r: 32 } ];

drawComponent(posX, posY, 'img/voltage.svg', term);

Circuit.addComponent({
	type: 'voltage',
	position: { x: posX, y: posY },
	terminals: _.map(term, function(obj) { 
		return [ obj.x / GRID_SIZE + posX, obj.y / GRID_SIZE + posY ]; 
	})
});

posX = 16;
posY = 48;
term = [ { x: 32, y: 0, r: 32 } ];

drawComponent(posX, posY, 'img/gnd.svg', term);

Circuit.addComponent({
	type: 'gnd',
	position: { x: posX, y: posY },
	terminals: _.map(term, function(obj) { 
		return [ obj.x / GRID_SIZE + posX, obj.y / GRID_SIZE + posY ];
	})
});
// ABOVE IS FOR TESTING ONLY


// draws svg image
function drawComponent(x, y, path, terminals) {
	var imgSprite;
	var img = new Image();
	img.src = path;
	img.onload = function() {
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		canvas.getContext('2d').drawImage(img, 0, 0);
		var imgTex = new PIXI.Texture.fromCanvas(canvas);
		imgSprite = new PIXI.Sprite(imgTex);
		imgSprite.interactive = true;
		var component = new PIXI.Container();
		component.addChildAt(imgSprite, 0);
		component.position = { x: x * GRID_SIZE, y: y * GRID_SIZE };
		selectEnable(imgSprite, component, true);
		container.addChild(component);

		function printArguments() {
			console.log(arguments);
		}

		// draw junctions
		_.each(terminals, function(obj) { drawJunction(obj.x, obj.y, obj.r, component); });

			// for (var i = 0; i < terminals.length; i++) {
			// 	drawJunction(terminals[i].x, terminals[i].y, terminals[i].r, component);
			// }
		update();
	};
}

function selectEnable(target, parent, draggable) {
	target.mousedown = function(event) {
		event.stopPropagation();
		target.mousedown = function() {};
		select();

		function select() {
			// focus handler
			blur();
			blur = function() {
				parent.removeChildAt(0);
				target.mousedown = function() { select(); };
			};
			update();

			drawTransformationBox(target, parent);

			if (draggable) {
				drag(event);
			}

			function drag(dragEvent) {
				// pivot point
				var px, py;
				px = dragEvent.data.global.x - parent.position.x;
				py = dragEvent.data.global.y - parent.position.y;

				_parent = parent;

				background.mousemove = function(event) {
					moveMode = true;
					_moveX = Util.snap(event.data.global.x - px, GRID_SIZE);
					_moveY = Util.snap(event.data.global.y - py, GRID_SIZE);
					update();
				};

				container.mouseup = function(event) {
					background.mousemove = function() {};
					container.mouseup = function() {};
					target.mousedown = function(event) { drag(event); };
				};
			}
		}
	};

}

function drawTransformationBox(target, parent) {
	var width = target.width, height = target.height;
	bbox = new PIXI.Graphics();
	bbox.lineStyle(0.5, 0x000000);
	bbox.drawRect(0, 0, width, height);
	parent.addChildAt(bbox, 0);

	// scaling

	// for (var i = 0; i < 4; i++) {
	// 	anchor = new PIXI.Graphics();
	// 	anchor.lineStyle(2, 0x000000);
	// 	anchor.beginFill(0xFFFFFF);
	// 	anchor.drawCircle(i * (target.width),i * (target.height), 4);
	// 	anchor.endFill();
	// 	anchor.hitArea = new PIXI.Circle(0, 0, 16);
	// 	anchor.interactive = true;
	// 	scaleEnable(anchor, bbox, target, parent);
	// 	parent.addChild(anchor);
	// }
	update();
}

function scaleEnable(anchor, bbox, target, parent) {
	anchor.mousedown = function(event) {
		var width = target.width,
			height = target.height,
			px = event.data.global.x - target.position.x,
			py = event.data.global.y - target.position.y;

		_parent = parent;
		_target = target;
		_bbox = bbox;

		background.mousemove = function(event) {
			scaleMode = true;
			_moveX = Util.snap(event.data.global.x, GRID_SIZE);
			_moveY = Util.snap(event.data.global.y, GRID_SIZE);
			_scaleX = 1 - Util.snap(event.data.global.x - px, GRID_SIZE) / width;
			_scaleY = 1 - Util.snap(event.data.global.y - py, GRID_SIZE) / height;
		};

		container.mouseup = function() {
			background.mousemove = function() {};
		};
	};
}

function update() {  // drawing loop
	if (wireMode) {
		if (!diagonal && !snapMode) {
			if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
			    y2 = y1;
			} else {
			    x2 = x1;
			}
		}
		wire.clear();
		wire.lineStyle(2, 0x000000);
		wire.moveTo(0, 0);
		wire.lineTo(x2 - x1, y2 - y1);
		wireMode = false;
		requestAnimationFrame(update);
	}

	if (scaleMode) {
		_parent.position.x = _moveX;
		_parent.position.y = _moveY;
		_target.scale.x = _scaleX;
		_target.scale.y = _scaleY;
		_bbox.graphicsData[0].shape.width = _target.width;
		_bbox.graphicsData[0].shape.height = _target.height;
		scaleMode = false;
		requestAnimationFrame(update);
	}

	if (moveMode) {
		_parent.position.x = _moveX;
		_parent.position.y = _moveY;
		moveMode = false;
		requestAnimationFrame(update);
	}

	renderer.render(container);
}