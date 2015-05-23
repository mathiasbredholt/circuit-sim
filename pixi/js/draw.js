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

var wireMode = false, moveMode = false, scaleMode = false, _moveX, _moveY, _scaleX, _scaleY, _parent, _target, _bbox;
var blur = function() {};

x1 = 64; y1 = 64; drawNode(); // For testing

var imgSprite;

// draws svg image
var img = new Image();
img.src = 'img/resistor.svg';
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
	component.position = { x: 128, y: 128 };
	selectEnable(imgSprite, component, true);
	container.addChild(component);
	update();
};


background.mousedown = function(event) {
	// focus handler
	blur();
	blur = function() {};

	if (drawMode) {
		resetWire();
		x1 = snap(event.data.global.x);
		y1 = snap(event.data.global.y);
		beginWire();
	}
};

function drawNode() {
	var node = new PIXI.Graphics();
	node.beginFill(0x000000);
	node.drawCircle(x1, y1, 4);
	node.endFill();
	node.hitArea = new PIXI.Circle(x1, y1, 16);
	node.interactive = true;
	node.mousedown = function(event) {// begin or end wire drawing
		// focus handler
		blur();
		blur = function() {};

		event.stopPropagation();
		drawMode = !drawMode;
		if (!drawMode) {
			resetWire();
		}
		x1 = snap(event.data.global.x);
		y1 = snap(event.data.global.y);
		if (drawMode) {
			beginWire();
		}
	};
	container.addChild(node);
}

function beginWire() {
	document.onmousemove = function(event) {
		diagonal = event.altKey;
		if (wireMode) update();
		if (drawMode) {
			wireMode = true;
			x2 = snap(event.clientX);
			y2 = snap(event.clientY);		
		}	
	};
	wire = new PIXI.Graphics();
	container.addChild(wire);
	update();
}

function resetWire() {
	var poly = new PIXI.Graphics();
	poly.beginFill(0xFF0000, 0.5);
	poly.drawPolygon(calculateBounds());
	// if (!diagonal) {
	// 	poly.drawRect(x1 - 4, y1 - 4, x2 - x1 + 8, y2 - y1 + 8);
	// }
	// else {
	// 	poly.rotation = Math.atan((y2 - y1)/(x2 - x1));
	// 	poly.drawRect( -4, -4, x2 - x1 + 8, 8);
	// 	poly.position = { x: x1, y: y1 };
	// }
	poly.endFill();
	wire.addChildAt(poly, 0);

	// calculate the snap area
	//wire.hitArea =  new PIXI.Polygon(calculateBounds());
	wire.interactive = true;
	wire.mousedown = function(event) {
		event.stopPropagation();
		resetWire();
		x1 = snap(event.data.global.x);
		y1 = snap(event.data.global.y);
		drawMode = !drawMode;
		drawNode();
	};
}

function drawTransformationBox(target, parent) {
	var width = target.width, height = target.height;
	bbox = new PIXI.Graphics();
	bbox.lineStyle(0.5, 0x000000);
	bbox.drawRect(0, 0, width, height);
	parent.addChildAt(bbox, 0);
	update();
	
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
					_moveX = snap(event.data.global.x - px);
					_moveY = snap(event.data.global.y - py);
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
			_moveX = snap(event.data.global.x);
			_moveY = snap(event.data.global.y);
			_scaleX = 1 - snap(event.data.global.x - px) / width;
			_scaleY = 1 - snap(event.data.global.y - py) / height;
		};

		container.mouseup = function() {
			background.mousemove = function() {};
		};
	};
}

function update() {  // drawing loop
	if (wireMode) {
		var dx, dy;
		dx = x1 - x2;
	    dy = y1 - y2;

		if (!diagonal) {
			if (Math.abs(dx) > Math.abs(dy)) {
			    y2 = y1;
			} else {
			    x2 = x1;
			}
		}
		wire.clear();
		wire.lineStyle(2, 0x000000);
		wire.moveTo(x1, y1);
		wire.lineTo(x2, y2);
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

function calculateBounds() { // calculates bounds for the snap area of the wires
	var width = 10;
		var dx = x2 - x1;
		var dy = y2 - y1;
		var len = Math.sqrt(dx*dx+dy*dy);

		var vec = [-(width/2)*dy/len,(width/2)*dx/len];

		var p1 = [x1 + vec[0], y1 + vec[1]];
		var p2 = [x1 - vec[0], y1 - vec[1]];
		var p3 = [x2 - vec[0], y2 - vec[1]];
		var p4 = [x2 + vec[0], y2 + vec[1]];

		return [ p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], p4[0], p4[1] ];
}

function snap(x) {
	return Math.round((x)/8)*8;
}