// Umbra game engine by Travis Martin. Based on Ga.

const UMBRA = {}; // Export.
UMBRA.VER = "1.0";

UMBRA.new = (setup, load, assetPaths = [], fps = 60, bounds = { x: window.innerWidth, y: window.innerHeight }, bgColor = "black", title = "Umbra") => {
	const umbra = {}; // Returned object.
	UMBRA.instance = umbra;

	// Change window title.
	document.title = title;

	// Canvas setup.
	umbra.canvas = document.createElement("canvas"); // Canvas.
	umbra.canvas.style = `width: ${bounds.x}; height: ${bounds.y}; background-color: ${bgColor}; touch-action: none;`; // Stylize canvas.
	document.body.style.margin = 0; // Remove default margins on page.
	document.body.appendChild(umbra.canvas); // Add canvas to page.
	umbra.context = umbra.canvas.getContext("webgl"); // WebGL context.

	// Sprite lists.
	umbra.draggableSprites = []; // Sprites that can be drag-and-dropped.
	umbra.interactiveSprites = []; // Sprites that can be clicked.

	// Properties.
	umbra.drag = false; // Whether or not drag-and-drop is enabled.

	// Make scene.
	umbra.scene = UMBRA.newSprite();
	umbra.scene.size = { x: umbra.canvas.width, y: umbra.canvas.height };

	// Initialize mouse/touch and keyboard.
	umbra.pointer = UMBRA.newPointer();
}

// Equivalent to makeDisplayObject in Ga.
UMBRA.newSprite = (umbra = UMBRA.instance) => {
	sprite = {
		pos: { x: 0, y: 0 }, // Position of sprite relative to parent.
		v: { x: 0, y: 0 }, // Velocity of sprite.
		size: { x: 0, y: 0 }, // Width and height of sprite.
		scale: { x: 1, y: 1 }, // Width and height scale of sprite.
		pivot: { x: 0.5, y: 0.5 }, // Center of rotation of sprite.
		rotation: 0, // Rotation of sprite.
		visible: true, // Visibility of sprite.
		_parent: undefined, // See parent.
		shadow: {
			visible: false, // Whether the sprite emits a shadow.
			color: "rgba(100, 100, 100, 0.5)", // Color of sprite's shadow.
			offset: { x: 3, y: 3 }, // Offset of sprite's shadow.
			blur: 3 // Blur of sprite's shadow.
		},
		alpha: 1, // Opacity of sprite.
		_draggable: false, // See draggable.
		layer: 0, // Depth layer of sprite. Higher values go over lower values.
		_interactive: false, // See interactive.
		prevPos: { x: 0, y: 0 }, // Position of sprite last frame.
		children: [] // Sprites that have this sprite as a parent.
	};

	Object.defineProperties(sprite, {
		gPos: {
			// Global position of sprite.
			get: () => {
				if (sprite.parent) { return { x: sprite.x + sprite.parent.x, y: sprite.y + sprite.parent.y }; }
				return sprite.pos;
			}
		},
		parent: {
			// Parent of sprite.
			get: () => sprite._parent,
			set: (value) => {
				if (sprite.parent) { sprite.parent.children.splice(sprite.parent.children.indexOf(sprite), 1); }
				sprite.parent = value;
				if (sprite.parent) { sprite.parent.children.push(sprite); }
			}
		},
		draggable: {
			// Whether the sprite can be drag-and-dropped.
			get: () => sprite._draggable,
			set: (value) => {
				sprite._draggable = value;
				if (value) {
					umbra.draggableSprites.push(sprite);
					umbra.drag = true;
				} else { umbra.draggableSprites.splice(umbra.draggableSprites.indexOf(sprite), 1); }
			}
		},
		interactive: {
			// Whether the sprite is clickable.
			get: () => sprite._interactive,
			set: (value) => {
				sprite._interactive = value;
				if (value) {
					umbra.interactiveSprites.push(sprite);
				} else { umbra.interactiveSprites.splice(umbra.interactiveSprites.indexOf(sprite), 1); }
			}
		}
	});

	return sprite;
}

UMBRA.newPointer = (umbra = UMBRA.instance) => {
	pointer = {
		pos: { x: 0, y: 0 }, // Position of pointer.
		down: false, // Whether the pointer is being held down.
		tapped: false, // Whether the pointer was down for a short moment.
		downTime: undefined, // Time pointer became held down.
		elapsedTime: 0, // Time pointer has currently been held down.
		press: undefined, // User-definable press method.
		release: undefined, // User-definable release method.
		tap: undefined, // User-definable tap method.
		draggedSprite: null, // Currently drag-and-dropping sprite.
		dragOffset: { x: 0, y: 0 } // Offset of currently drag-and-dropping sprite.
	};

	// Handlers for mousemove events.
	umbra.canvas.addEventListener("mousemove", pointer.moveHandler); // Mouse.
	umbra.canvas.addEventListener("touchmove", pointer.moveHandler); // Touchscreen.
	pointer.moveHandler = (e) => {
		pointer.pos = pointer.eventPosition(e);
		e.preventDefault(); // Prevent the user from selecting the canvas.
	}

	// Handlers for mousedown events.
	umbra.canvas.addEventListener("mousedown", pointer.downHandler); // Mouse.
	umbra.canvas.addEventListener("touchstart", pointer.downHandler); // Touchscreen.
	pointer.downHandler = (e) => {
		pointer.pos = pointer.eventPosition(e);
		pointer.down = true;
		pointer.tapped = false;
		pointer.downTime = Date.now();
		if (pointer.press) { pointer.press(); } // Run user-defined press event.
		e.preventDefault(); // Prevent the user from selecting the canvas.
	}

	// Handlers for mouseup events.
	window.addEventListener("mouseup", pointer.upHandler); // Mouse.
	window.addEventListener("touchend", pointer.upHandler); // Touchscreen.
	pointer.upHandler = (e) => {
		pointer.elapsedTime = Math.abs(pointer.downTime - Date.now()); // Calculate elapsed time.
		if (pointer.elapsedTime <= 200) { // Counts as a tap if less than 200ms.
			pointer.tapped = true;
			if (pointer.tap) { pointer.tap(); } // Run user-defined tap event.
		}
		pointer.down = false;
		if (pointer.release) { pointer.release(); } // Run user-defined release event.
		e.preventDefault(); // Prevent the user from selecting the canvas.
	}

	pointer.eventPosition = (e) => {
		if (e.targetTouches) { return { x: e.targetTouches[0].pageX - umbra.canvas.offsetLeft, y: e.targetTouches[0].pageY - umbra.canvas.offsetTop }; }
		return { x: e.pageX - e.target.offsetLeft, y: e.pageY - e.target.offsetTop };
	}

	// Checks if the pointer is touching the passed sprite.
	pointer.touchingSprite = (sprite) => pointer.pos.x > sprite.gPos.x && pointer.pos.x < sprite.gPos.x + sprite.size.x && pointer.pos.y > sprite.gPos.y && pointer.pos.y < sprite.gPos.y + sprite.size.y;

	// Drag-and-drop.
	pointer.dragUpdate = () => {
		if (pointer.down) {
			if (pointer.draggedSprite) {
				// Move currently dragged sprite.
				pointer.draggedSprite.pos = { x: pointer.pos.x - pointer.dragOffset.x, y: pointer.pos.y - pointer.dragOffset.y };
			} else {
				// Acquire a new dragged sprite.
				for (let i = umbra.draggableSprites.length; i >= 0; i++) {
					const sprite = umbra.draggableSprites[i];
					if (sprite.draggable && pointer.touchingSprite(sprite)) {
						pointer.dragOffset = { x: pointer.pos.x - sprite.gPos.x, y: pointer.pos.y - sprite.gPos.y };
						pointer.draggedSprite = sprite;
						sprite.parent = sprite.parent; // Moves the sprite to the end of its parent's children array.
						umbra.draggableSprites.splice(umbra.draggableSprites.indexOf(sprite), 1);
						umbra.draggableSprites.push(sprite); // Does the same thing to the draggable sprites array.
						break;
					}
				}
			}
		} else { pointer.draggedSprite = null; } // Drop dragged sprite if pointer is up.

		// Change mouse to a hand if it's over a draggable sprite.
		umbra.draggableSprites.some((sprite) => {
			if (sprite.draggable && pointer.touchingSprite(sprite)) {
				umbra.canvas.style.cursor = "pointer";
				return true;
			} else {
				umbra.canvas.style.cursor = "auto";
				return false;
			}
		});
	}

	return pointer;
}

exports = UMBRA;
