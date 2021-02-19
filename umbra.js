class Umbra {
	// Umbra Framework version.
	static version = '3.0';

	// Active scene.
	#scene;

	// Used internally to trigger events on Components.
	#trigger = (event) => {
		const getComponentsRecursive = (gameObject, output = []) => {
			if (!gameObject || !gameObject.enabled) {
				return output;
			}

			gameObject.components
				.filter((component) => component[event])
				.forEach((component) => output.push(component));

			for (const child of gameObject.children) {
				getComponentsRecursive(child, output);
			}

			return output;
		};

		getComponentsRecursive(this.#scene)
			.sort((a, b) => a.priority > b.priority ? 1 : -1)
			.forEach((component) => component[event](this));
	};

	constructor(
		// Creates a fullscreen canvas by default.
		canvas = (() => {
			const canvas = document.createElement('canvas');
			canvas.style = 'touch-action:none;width:100%;height:100%;';
			/*
			 * CSS
			 *
			 * touch-action: none;
			 * width: 100%;
			 * height: 100%;
			 */

			document.body.appendChild(canvas);
			document.body.style = 'margin:0;padding:0;';
			/*
			 * CSS
			 *
			 * margin: 0;
			 * padding: 0;
			 */

			return canvas;
		})(),

		// Updates per second for the fixed update loop.
		ups = 30
	) {
		this.canvas = canvas;
		this.gl = this.canvas.getContext('webgl2');

		// Update loop; variable frequency.
		const update = () => {
			requestAnimationFrame(update);
			
			if (!this.paused) {
				this.#trigger(Component.events.UPDATE);
			}
		};
		update();

		// Fixed update loop; fixed frequency.
		setInterval(() => {
			if (!this.paused) {
				this.#trigger(Component.events.FIXED);
			}
		}, 1000 / ups);
	}

	get scene() {
		return this.#scene;
	}

	set scene(value) {
		this.#scene = value;
		this.#trigger(Component.events.LOAD);
	}
}

class GameObject {
	#parent;
	#children;

	constructor(enabled = true) {
		this.enabled = enabled;
		this.#children = [];
		this.components = [];
	}

	get parent() {
		return this.#parent;
	}

	set parent(value) {
		if (this.#parent) {
			this.#parent.children.splice(this.#parent.children.indexOf(this), 1);
		}
		
		this.#parent = value;
		this.#parent.children.push(this);
	}

	get children() {
		return this.#children;
	}
}

class Component {
	// Enumeration of events.
	static events = {
		LOAD: 'l', // Called when the Scene containing the GameObject this Component belongs to is loaded.
		UPDATE: 'u', // Called on each animation frame; varies in frequency based on lag.
		FIXED: 'f' // Called by a fixed timer; 30 times per second by default.
	};

	#gameObject;

	constructor(gameObject, priority = 0) {
		this.#gameObject = gameObject;
		this.#gameObject.components.push(this);

		this.priority = priority;
	}

	get gameObject() {
		return this.#gameObject;
	}
}

class DrawingBufferResizer extends Component {
	constructor(gameObject, priority = -1) {
		super(gameObject, priority);

		this[Component.events.UPDATE] = (umbra) => {
			const canvas = umbra.canvas;

			const displayWidth = canvas.clientWidth;
			const displayHeight = canvas.clientHeight;

			if (canvas.width != displayWidth || canvas.height != displayHeight) {
				canvas.width = displayWidth;
				canvas.height = displayHeight;
			}
		};
	}
}

class Background extends Component {
	constructor(gameObject, r = 0, g = 0, b = 0, a = 1, priority = -1) {
		super(gameObject, priority);

		this[Component.events.LOAD] = (umbra) => umbra.gl.clearColor(r, g, b, a);
		this[Component.events.UPDATE] = (umbra) => umbra.gl.clear(umbra.gl.COLOR_BUFFER_BIT);
	}
}

class WebGLUtility {
	static createShader = (gl, type, src) => {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error(`Failed to create shader: ${gl.getShaderInfoLog(shader)}`);
			gl.deleteShader(shader);
			return;
		}

		return shader;
	};

	static createProgram = (gl, vertexShader, fragmentShader) => {
		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error(`Failed to create program: ${gl.getProgramInfoLog(program)}`);
			gl.deleteProgram(program);
			return;
		}

		return program;
	};
}
