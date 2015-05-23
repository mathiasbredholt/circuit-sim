console.log(Util);

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
var x1, x2, y1, y2;

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

	if (drawMode) {
		resetWire();
		x1 = x2;
		y1 = y2;
		beginWire();
	}
};

function drawNode(x, y, rad, parent) {
	var node = new PIXI.Graphics();
	node.beginFill(0x000000);
	node.drawCircle(0, 0, 4);
	node.endFill();
	node.hitArea = new PIXI.Circle(0, 0, rad);
	node.position.x = x;
	node.position.y = y;
	node.interactive = true;

	var area = new PIXI.Graphics();
	area.beginFill(0x0000FF, 0.25);
	area.drawCircle(0, 0, 32);
	area.endFill();
	node.addChildAt(area, 0);
	node.mousedown = function(event) {// begin or end wire drawing
		// focus handler
		blur();
		blur = function() {};

		event.stopPropagation();

		drawMode = !drawMode;
		
		if (!drawMode) {
			x2 = parent.position.x + node.position.x;
			y2 = parent.position.y + node.position.y;
			resetWire();
		}
		
		if (drawMode) {
			x1 = parent.position.x + node.position.x;
			y1 = parent.position.y + node.position.y;
			beginWire();
		}
	};
	node.mouseover = function() {
		if (drawMode) {
			snapMode = true;
			wireMode = true;
			x2 = parent.position.x + node.position.x;
			y2 = parent.position.y + node.position.y;
			update();
		}
	};
	node.mouseout = function() {
		if (drawMode) {
			snapMode = false;
			wireMode = true;
			update();
		}
	};
	parent.addChild(node);
	update();
}

function beginWire() {
	wire = new PIXI.Graphics();
	wire.position.x = x1;
	wire.position.y = y1;
	container.addChildAt(wire, 1);
	console.log(wire);
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

	wire.hitArea =  new PIXI.Polygon(calculateBounds());
	wire.interactive = true;
	wire.mousedown = function(event) {
		event.stopPropagation();
		resetWire();
		drawMode = !drawMode;
		drawNode(x2, y2, 32, event.target);
	};
	wire.mouseover = function(event) {
		// !!! CHANGE !!! need to snap to intersection instead of start position
		if (drawMode) {
			snapMode = true;
			wireMode = true;
			x2 = event.target.position.x;
			y2 = event.target.position.y;
			update();
		}
	};
	wire.mouseout = function() {
		if (drawMode) {
			snapMode = false;
			wireMode = true;
			update();
		}
	};

	document.getElementById('wires').innerHTML += Util.formatStr('<p>({0}, {1}) -> ({2},{3})</p>', x1 / GRID_SIZE, y1 / GRID_SIZE, x2 / GRID_SIZE, y2 / GRID_SIZE);
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
termResistor = [ [ 32, 64, 32 ], [ 96, 64, 32 ] ];
termCapacitor = [ [ 0, 32, 32 ], [ 64, 32, 32 ] ];

// --- COMPONENT DRAWING ---
drawComponent(128, 128, 'img/resistor.svg', termResistor);
drawComponent(320, 128, 'img/capacitor.svg', termCapacitor);
drawComponent(320, 256, 'img/voltage.svg', termCapacitor);


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
		component.position = { x: x, y: y };
		selectEnable(imgSprite, component, true);
		container.addChild(component);
		
		// draw nodes
		for (var i = 0; i < terminals.length; i++) {
			drawNode(terminals[i][0], terminals[i][1], terminals[i][2], component);
		}
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