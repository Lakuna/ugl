// Umbra Web Framework version 3.0
// Copyright (c) Travis Martin 2021
// MIT License

class Umbra {
	// Umbra Framework version.
	static version = '3.0';

	// Active scene.
	#scene;

	constructor(
		// Creates a fullscreen canvas by default.
		canvas = (() => {
			const canvas = document.createElement('canvas');
			canvas.style = 'touch-action:none;width:100%;height:100%;';
			/* CSS
			canvas {
				touch-action: none;
				width: 100%;
				height: 100%;
			}
			*/

			document.body.appendChild(canvas);
			document.body.style = 'margin:0;';
			/* CSS
			body {
				margin: 0px;
			}
			*/

			return canvas;
		})(),

		// Updates per second for the fixed update loop.
		ups = 30
	) {
		this.canvas = canvas;
		this.gl = this.canvas.getContext('webgl2');
		if (!this.gl) {
			console.error('WebGL2 is not supported by your browser.');
		}

		let then = 0; // Used for deltaTime calculations.

		// Update loop; variable frequency.
		const update = (now) => {
			requestAnimationFrame(update);

			// Calculate time between frames in seconds. fps = 1 / deltaTime
			this.deltaTime = (now - then) * 0.001 || 0;
			then = now;
			
			if (!this.paused) {
				this.trigger(Component.events.UPDATE);
			}
		};
		update();

		// Fixed update loop; fixed frequency.
		setInterval(() => {
			if (!this.paused) {
				this.trigger(Component.events.FIXED);
			}
		}, 1000 / ups);
	}

	get scene() {
		return this.#scene;
	}

	set scene(value) {
		this.#scene = value;
		this.trigger(Component.events.LOAD);
	}

	// Used to trigger events on Components.
	trigger(event) {
		const getComponentsRecursive = (gameObject, output = []) => {
			if (!gameObject || !gameObject.enabled) {
				return output;
			}

			[...gameObject.components]
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
	}
}

// Represents anything that exists within the scene (and the scene itself).
class GameObject {
	#parent;
	#children;

	constructor(enabled = true) {
		this.enabled = enabled;
		this.#children = new UArray();
		this.components = new UArray();
	}

	get parent() {
		return this.#parent;
	}

	set parent(value) {
		if (this.#parent) {
			this.#parent.children.remove(this);
		}
		
		this.#parent = value;
		this.#parent.children.push(this);
	}

	// Returns a UArray of children.
	get children() {
		return this.#children.copy(); // Returns a copy so that the children cannot be modified except through setting the parent of each child.
	}

	// Gets the first component of type type.
	getComponent = (type) => this.components.find((component) => component instanceof type);
}

// A script which can be attached to GameObjects to give them a purpose.
class Component {
	// Enumeration of events.
	static events = {
		LOAD: 0, // Called when the Scene containing the GameObject this Component belongs to is loaded.
		UPDATE: 1, // Called on each animation frame; varies in frequency based on lag.
		FIXED: 2 // Called by a fixed timer; 30 times per second by default.
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

// A premade Component which resizes a canvas' drawing buffer to match its actual size on the screen.
// Only useful for canvases with size set based on screen size (i.e. "width: 100%;").
class CanvasResizer extends Component {
	constructor(gameObject, priority = -2) {
		super(gameObject, priority);

		this[Component.events.UPDATE] = (umbra) => {
			const canvas = umbra.canvas;

			const displayWidth = canvas.clientWidth;
			const displayHeight = canvas.clientHeight;

			if (canvas.width != displayWidth || canvas.height != displayHeight) {
				canvas.width = displayWidth;
				canvas.height = displayHeight;

				umbra.gl.viewport(0, 0, canvas.width, canvas.height);
			}
		}
	}
}

// A premade Component which clears the screen and sets the background to a specified color.
class Background extends Component {
	constructor(gameObject, r = 0, g = 0, b = 0, a = 1, priority = -1) {
		super(gameObject, priority);

		this[Component.events.LOAD] = (umbra) => umbra.gl.clearColor(r, g, b, a);
		this[Component.events.UPDATE] = (umbra) => umbra.gl.clear(umbra.gl.COLOR_BUFFER_BIT | umbra.gl.DEPTH_BUFFER_BIT);
	}
}

// Static math class with generically useful methods.
class UMath {
	// Summation notation.
	static sigma = (min, max, equation, output = 0) => output += equation(min) + (min < max ? UMath.sigma(min + 1, max, equation, output) : 0);

	// Convert value in degrees to equivalent value in radians.
	static degreesToRadians = (d) => d * Math.PI / 180;
}

// Custom Array class with methods that are useful for both Vectors and Matrices.
class UArray extends Array {
	// Create a new UArray with values based on a rule.
	static fromRule(length, rule = (i) => i) {
		let data = [];
		for (let i = 0; i < length; i++) {
			data[i] = rule(i);
		}
		return new UArray(...data);
	}

	constructor(...data) {
		super();
		this.setData(...data);
	}

	// Returns a copy of this UArray.
	copy = () => new UArray(...this);

	// "this.setData(...data);" = "this = [...data];"
	setData(...data) {
		while (this.length > 0) {
			this.pop();
		}
		for (let i = 0; i < data.length; i++) {
			this[i] = data[i];
		}
		return this;
	}

	// Remove the first instance of element from the UArray.
	remove = (element) => this.splice(this.indexOf(element), 1);
}

// Represents a point in space.
class Vector extends UArray {
	// Find the cross product of this and another Vector.
	cross = (vector) => new Vector(...UArray.fromRule(this.length, (i) => {
		const loopingIncrement = (i) => i + 1 >= this.length ? 0 : i + 1;
		i = loopingIncrement(i);
		let j = loopingIncrement(i);
		return this[i] * vector[j] - this[j] * vector[i];
	}));

	// Returns a copy of this Vector.
	copy = () => new Vector(...this);

	// Perform an operation between two Vectors. Defaults to addition.
	operate = (vector, operation = (a, b) => a + b) => this.setData(...UArray.fromRule(this.length, (i) => operation(this[i], vector[i])));

	// Normalize Vector length to a point on a unit circle/sphere/et cetera.
	normalize = () => this.setData(...UArray.fromRule(this.length, (i) => this[i] / this.magnitude));

	// Multiply the Vector by a Matrix to apply transforms.
	transform = (matrix) => this.setData(...new Matrix(...matrix).multiply(this));

	// Find the length ("magnitude") of the Vector.
	get magnitude() {
		return Math.sqrt(UMath.sigma(0, this.length - 1, (i) => this[i] ** 2));
	}
}

// Used primarily to transform Vectors in WebGL.
class Matrix extends UArray {
	static fromRule(width, height, rule = (x, y) => x + y) {
		let data = [];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				data[y * width + x] = rule(x, y);
			}
		}
		return new Matrix(...data);
	}

	// Create an identity Matrix with the given number of dimensions.
	static identity = (dim = 4) => Matrix.fromRule(dim, dim, (x, y) => x == y ? 1 : 0);

	// Creates a new Matrix. Defaults to a 4D identity Matrix.
	constructor(...data) {
		super(...(data.length ? data : Matrix.identity()));
	}

	// Creates a copy of this Matrix.
	copy = () => new Matrix(...this);

	// "array.getPoint(x, y);" = "matrix[y][x];", where "array" contains the same data as "matrix" when flattened in row-major order.
	getPoint = (x, y, width = Math.sqrt(this.length)) => this[y * width + x];

	// "array.setPoint(x, y, value);" = "matrix[y][x] = value;", where "array" contains the same data as "matrix" when flattened in row-major order.
	setPoint = (x, y, value, width = Math.sqrt(this.length)) => (this[y * width + x] = value) ? this : this;

	// Multiply by another Matrix via iterative algorithm.
	// If C = AB for an (n * m) Matrix A and an (m * p) Matrix B, then C is an (n * p) Matrix with entries.
	multiply(matrix, m = Math.sqrt(this.length)) {
		matrix = new Matrix(...matrix); // Only necessary if you want to allow matrix to be any Array.

		// A is this.
		// B is matrix.
		// C is the return value.

		const n = this.length / m;
		const p = matrix.length / m;

		return this.setData(...Matrix.fromRule(n, p, (i, j) => UMath.sigma(0, m - 1, (k) => this.getPoint(i, k) * matrix.getPoint(k, j))));
	}

	// Translate by (x, y, z).
	translate = (x, y, z) => this.multiply([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1
	]);

	// Rotate d degrees about the x axis.
	pitch(d) {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply([
			1, 0, 0, 0,
			0, c, s, 0,
			0, -s, c, 0,
			0, 0, 0, 1
		]);
	}

	// Rotate d degrees about the y axis.
	yaw(d) {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply([
			c, 0, -s, 0,
			0, 1, 0, 0,
			s, 0, c, 0,
			0, 0, 0, 1
		]);
	}

	// Rotate d degrees about the z axis.
	roll(d) {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply([
			c, s, 0, 0,
			-s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]);
	}

	// Perform pitch(x), yaw(y), and roll(z).
	rotate = (x, y, z) => this.pitch(x).yaw(y).roll(z);

	// Scale by (x, y, z) times.
	scale = (x, y, z) => this.multiply([
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	]);

	// Invert a matrix via Gaussian elimination.
	// Based on work by Andrew Ippoliti.
	invert(dim = Math.sqrt(this.length)) {
		if (dim ** 2 != this.length) {
			return console.error('Cannot invert a non-square Matrix.');
		}

		const identity = Matrix.identity(dim);
		const copy = this.copy(); // Make duplicate to avoid modifying the Matrix in case of failure.

		// Perform elementary row operations.
		for (let i = 0; i < dim; i++) {
			let diagonal = copy.getPoint(i, i); // Get the element on the diagonal.

			// If there is a 0 on the diagonal, swap this row with a lower row.
			if (diagonal == 0) {
				for (let ii = i + 1; ii < dim; ii++) {
					if (copy.getPoint(ii, i) != 0) {
						for (let j = 0; j < dim; j++) {
							// Swap the rows in each Matrix.
							[copy, identity].forEach((matrix) => {
								let temp = matrix.getPoint(i, j);
								matrix.setPoint(i, j, matrix.getPoint(ii, j));
								matrix.setPoint(ii, j, temp);
							});
						}

						break;
					}
				}

				diagonal = copy.getPoint(i, i); // Get the new diagonal after swaps.

				// If the diagonal is still 0, the Matrix is not invertible.
				if (diagonal == 0) {
					return console.error('Matrix is not invertible.');
				}
			}

			// Scale this row down by the diagonal so that there is a 1 on the diagonal.
			for (let j = 0; j < dim; j++) {
				[copy, identity].forEach((matrix) => matrix.setPoint(i, j, matrix.getPoint(i, j) / diagonal));
			}

			// Subtract this row from all of the other rows so that there are 0s in this column in the rows above and below this one.
			for (let ii = 0; ii < dim; ii++) {
				if (ii == i) {
					continue;
				}

				let temp = copy.getPoint(ii, i);

				for (let j = 0; j < dim; j++) {
					[copy, identity].forEach((matrix) => matrix.setPoint(ii, j, matrix.getPoint(ii, j) - temp * matrix.getPoint(i, j)));
				}
			}
		}

		// Copy should now match the identity, and identity should now be the inverse.
		return this.setData(...identity);
	}

	orthographic = (left, right, top, bottom, near, far) => this.multiply([
		2 / (right - left), 0, 0, 0,
		0, 2 / (top - bottom), 0, 0,
		0, 0, 2 / (near - far), 0,
		(left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1
	]);

	perspective(fov, aspectRatio, near, far) {
		const f = Math.tan(Math.PI * 0.5 - 0.5 * UMath.degreesToRadians(fov));
		const range = 1.0 / (near - far);

		return this.multiply([
			f / aspectRatio, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (near + far) * range, -1,
			0, 0, near * far * range * 2, 0
		]);
	}

	lookAt(position, target, up = [0, 1, 0]) {
		const zAxis = new Vector(...position).operate(target, (a, b) => a - b).normalize();
		const xAxis = new Vector(...up).cross(zAxis).normalize();
		const yAxis = zAxis.copy().cross(xAxis).normalize();

		return this.multiply([
			...xAxis, 0,
			...yAxis, 0,
			...zAxis, 0,
			...position, 1
		]);
	}
}

// TODO
// Contains the transform information to generate a WebGL view projection Matrix.
class Camera {

}

/*
Standard WebGL program layout:

Init time:
- Create all shaders and programs and look up locations.
- Create buffers and upload vertex data.
- Create a vertex array for each thing you want to draw.
	- For each attribute call gl.bindBuffer, gl.vertexAttribPointer, and gl.enableVertexAttribArray.
	- Bind any indices to gl.ELEMENT_ARRAY_BUFFER.
- Create textures and upload texture data.

Render time:
- Clear and set the viewport and other global state.
- For each thing you want to draw:
	- Call gl.useProgram for the program needed to draw.
	- Bind the vertex array for that thing (gl.bindVertexArray).
	- Setup uniforms for the thing you want to draw.
		- Call gl.uniformXXX for each uniform.
		- Call gl.activeTexture and gl.bindTexture to assign textures to texture units.
	- Call gl.drawArrays or gl.drawElements.
*/

// WebGL attribute, varying, uniform, and fragment color information container.
class GLVariableInfo {
	static scopes = {
		ATTRIBUTE: 0,
		VARYING: 1,
		UNIFORM: 2,
		FRAGMENT_COLOR: 3
	};

	#location;

	constructor(scope, type, name) {
		this.scope = scope;
		this.type = type;
		this.name = name;
	}

	src(isVertexShader) {
		let scopeText;
		switch (this.scope) {
			case GLVariableInfo.scopes.ATTRIBUTE:
				scopeText = isVertexShader ? 'in' : 0;
				break;
			case GLVariableInfo.scopes.VARYING:
				scopeText = isVertexShader ? 'out' : 'in';
				break;
			case GLVariableInfo.scopes.UNIFORM:
				scopeText = 'uniform';
				break;
			case GLVariableInfo.scopes.FRAGMENT_COLOR:
				scopeText = isVertexShader ? 0 : 'out';
		}

		return scopeText ? `${scopeText} ${this.type} ${this.name};` : '';
	}

	set location(value) {
		if (this.#location) {
			return console.error('Cannot change the location of a GLVariableInfo.');
		}
		this.#location = value;
	}

	get location() {
		return this.#location;
	}
}

// Contains a WebGL buffer and its information.
class GLBufferInfo {
	constructor(gl, data, usage, target) {
		this.buffer = gl.createBuffer();

		// This is necessary because certain defaults cannot be set without access to gl.
		((usage = gl.STATIC_DRAW, target = gl.ARRAY_BUFFER) => {
			this.target = target;
			
			gl.bindBuffer(this.target, this.buffer);
			gl.bufferData(this.target, data, usage);

			this.update = (data) => {
				gl.bindBuffer(this.target, this.buffer);
				gl.bufferSubData(this.target, 0, data, 0);
			};
		})(usage, target);
	}
}

// Represents a WebGL texture and its information.
class GLTextureInfo {
	constructor(gl, defaultColor = [255, 0, 255, 255]) {
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(defaultColor));
	}

	loadFromUrl = (url) => new Promise((resolve, reject) => {
		const image = new Image();
		if ((new URL(url, location.href)).origin != location.origin) {
			image.crossOrigin = ''; // Request CORS.
		}
		image.addEventListener('load', () => {
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.generateMipmap(gl.TEXTURE_2D);
			resolve();
		});
		image.src = url; // Begin loading image.
	});
}

// Represents one shape's instance of a WebGL attribute, varying, uniform, or fragment color and its information.
class GLVariableInstanceInfo {
	constructor(location) {
		this.location = location;

		this.setValue = () => console.error('Not implemented.');
	}
}

// Represents one shape's instance of a WebGL attribute and its information.
class GLAttributeInstanceInfo extends GLVariableInstanceInfo {
	constructor(location, gl, bufferInfo, size, type, normalized = false, stride = 0, offset = 0) {
		super(location);

		gl.enableVertexAttribArray(this.location);
		gl.bindBuffer(bufferInfo.target, bufferInfo.buffer);

		// This is necessary because certain defaults cannot be set without access to gl.
		((type = gl.FLOAT) => {
			gl.vertexAttribPointer(this.location, size, type, normalized, stride, offset);

			this.setValue = (value) => bufferInfo.update(value);
		})(type);
	}
}

// Represents one shape's instance of a WebGL uniform and its information.
class GLUniformInstanceInfo extends GLVariableInstanceInfo {
	constructor(location, setterMethod, value) {
		super(location);

		// Call the setter method. Uses the last value if no new value is set.
		this.setValue = (value) => {
			cachedValue = value || cachedValue;

			setterMethod(this.location, cachedValue);
		};
		this.setValue(value);
	}
}

// Represents a WebGL2 shader program and its information.
class ShaderProgramInfo {
	constructor(gl, variables, vertexMainSrc, fragmentMainSrc, version = '#version 300 es', precision = 'precision highp float;') {
		this.gl = gl;
		this.variables = variables;

		// Build shader source code.

		// Headers
		let vertexSrc = `${version}\n`;
		let fragmentSrc = `${version}\n${precision}`;

		// Variables.
		for (const variable of this.variables) {
			vertexSrc += variable.src(true);
			fragmentSrc += variable.src();
		}

		// Main function.
		vertexSrc += `void main(){${vertexMainSrc}}`;
		fragmentSrc += `void main(){${fragmentMainSrc}}`;

		// Create shader program.

		this.program = this.gl.createProgram();
		[
			{ type: this.gl.VERTEX_SHADER, src: vertexSrc },
			{ type: this.gl.FRAGMENT_SHADER, src: fragmentSrc }
		].forEach((shaderInfo) => {
			const shader = this.gl.createShader(shaderInfo.type);
			this.gl.shaderSource(shader, shaderInfo.src);
			this.gl.compileShader(shader);

			if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
				console.error(this.gl.getShaderInfoLog(shader));
				this.gl.deleteShader(shader);
			}

			this.gl.attachShader(this.program, shader);
		});
		this.gl.linkProgram(this.program);

		if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			console.error(this.gl.getProgramInfoLog(this.program));
			this.gl.deleteProgram(this.program);
		}

		for (const variable of this.variables) {
			switch (variable.scope) {
				case GLVariableInfo.scopes.ATTRIBUTE:
					variable.location = this.gl.getAttribLocation(this.program, variable.name);
					break;
				case GLVariableInfo.scopes.UNIFORM:
					variable.location = this.gl.getUniformLocation(this.program, variable.name);
			}
		}
	}
}

class DefaultShaderProgramInfo extends ShaderProgramInfo {
	static names = {
		aPosition: 'a',
		aTexcoord: 'b',
		vTexcoord: 'c',
		uMatrix: 'd',
		uTexture: 'e',
		uTextureMask: 'f',
		uHue: 'g',
		outColor: 'h'
	};

	constructor(gl) {
		super(
			gl,
			[
				new GLVariableInfo(GLVariableInfo.scopes.ATTRIBUTE, 'vec4', DefaultShaderProgramInfo.names.aPosition),
				new GLVariableInfo(GLVariableInfo.scopes.ATTRIBUTE, 'vec2', DefaultShaderProgramInfo.names.aTexcoord),
				new GLVariableInfo(GLVariableInfo.scopes.VARYING, 'vec2', DefaultShaderProgramInfo.names.vTexcoord),
				new GLVariableInfo(GLVariableInfo.scopes.UNIFORM, 'mat4', DefaultShaderProgramInfo.names.uMatrix),
				new GLVariableInfo(GLVariableInfo.scopes.UNIFORM, 'sampler2D', DefaultShaderProgramInfo.names.uTexture),
				new GLVariableInfo(GLVariableInfo.scopes.UNIFORM, 'sampler2D', DefaultShaderProgramInfo.names.uTextureMask),
				new GLVariableInfo(GLVariableInfo.scopes.UNIFORM, 'vec4', DefaultShaderProgramInfo.names.uHue),
				new GLVariableInfo(GLVariableInfo.scopes.FRAGMENT_COLOR, 'vec4', DefaultShaderProgramInfo.names.outColor)
			],
			`gl_Position=${DefaultShaderProgramInfo.names.uMatrix}*${DefaultShaderProgramInfo.names.aPosition};${DefaultShaderProgramInfo.names.vTexcoord}=${DefaultShaderProgramInfo.names.aTexcoord};`,
			`${DefaultShaderProgramInfo.names.outColor}=texture(${DefaultShaderProgramInfo.names.uTexture},${DefaultShaderProgramInfo.names.vTexcoord})*texture(${DefaultShaderProgramInfo.names.uTextureMask},${DefaultShaderProgramInfo.names.vTexcoord})*${DefaultShaderProgramInfo.names.uHue};`
		);
		/* GLSL ES 3.00
		#version 300 es

		// Attibutes
		in vec4 a_position;
		in vec2 a_texcoord;

		// Varyings
		out vec2 v_texcoord;

		// Uniforms
		uniform mat4 u_matrix;

		void main() {
			gl_Position = u_matrix * a_position;

			v_texcoord = a_texcoord;
		}
		*/
		/* GLSL ES 3.00
		#version 300 es

		precision highp float;

		// Varyings
		in vec2 v_texcoord;

		// Uniforms
		uniform sampler2D u_texture;
		uniform sampler2D u_textureMask;
		uniform vec4 hue;

		// Output
		out vec4 outColor;

		void main() {
			outColor = texture(u_texture, v_texcoord) * texture(u_textureMask, v_texcoord) * hue;
		}
		*/
	}
}

// Represents one instance of one shape.
class Shape extends Component {
	constructor(programInfo, variableInfos) {
		this.variableInfos = variableInfos;

		this.vao = programInfo.gl.createVertexArray();
		programInfo.gl.bindVertexArray(this.vao);

		this[Component.events.UPDATE] = () => {
			// TODO
		};
	}
}

// Represents one instance of one shape which uses the DefaultShaderProgramInfo.
class DefaultShaderProgramShape extends Shape {
	constructor(programInfo) {
		// TODO
	}
}

// Represents one instance of a rectangular prism.
class Cube extends DefaultShaderProgramShape {
	// TODO
}

// TODO: Texture (+ Atlas).

// TODO: Primitives (Rectangle, Cube, Sphere, Pyramid?, Triangle).