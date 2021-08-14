# Multiple shapes in WebGL

## Typical program format
A typical WebGL program follows this structure:
- At initialization time:
	- Create all shaders and shader programs, and look up locations.
	- Create buffers and upload vertex data.
	- Create a VAO for each thing you want to draw.
		- For each attribute call `gl.bindBuffer`, `gl.vertexAttribPointer`, and `gl.enableVertexAttribArray`.
		- Bind any indices to the `ELEMENT_ARRAY_BUFFER`.
	- Create textures and upload texture data.
- At render time:
	- Clear and set the viewport and other global state.
	- For each thing you want to draw:
		- Call `gl.useProgram` for the program needed to draw.
		- Bind the VAO for that thing (`gl.bindVertexArray`).
		- Setup uniforms for the thing you want to draw.
			- Call `gl.uniform[1234][uif][v]` for each uniform.
			- Call `gl.activeTexture` and `gl.bindTexture` to assign textures to texture units.
		- Call `gl.drawArrays` or `gl.drawElements`.

## Multiple shapes example
This program will be fully written from scratch to show how each step lines up with the format above. If you've only read about the fundamentals of WebGL, much of the content of this page may be overwhelming. You do not need to understand everything that's happening in the code shown here - it's most important that the typical format makes sense to you.

### Initialization step

#### Create context
In order to draw on the screen, we need an HTML canvas element.
```html
&lt;canvas id="canvas"&gt;&lt;/canvas&gt;
&lt;style&gt;
	* {
		width: 100%;
		height: 100%;
		margin: 0px;
		padding: 0px;
	}
&lt;/style&gt;
&lt;script&gt;
	const canvas = document.querySelector("#canvas");
&lt;/script&gt;
```

If you're using Umbra, this can be done without HTML.
```html
&lt;script type="module"&gt;
	import { makeFullscreenCanvas } from "https://cdn.skypack.dev/@lakuna/umbra.js";

	const canvas = makeFullscreenCanvas();
&lt;/script&gt;
```

In order to use WebGL2, we need to get the rendering context of the canvas.
```js
const gl = canvas.getContext("webgl2");
if (!gl) { throw new Error("WebGL2 is not supported by your browser."); }
```

#### Create shaders
Vertex shader:
```glsl
#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
	gl_Position = u_matrix * a_position;

	v_color = a_color;
}
```

JavaScript string version:
```js
const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec4 a_color;
uniform mat4 u_matrix;
out vec4 v_color;
void main() {
	gl_Position = u_matrix * a_position;
	v_color = a_color;
}`;
```

Fragment shader:
```glsl
#version 300 es

in vec4 v_color;

uniform vec4 u_colorMult;

out vec4 outColor;

void main() {
	outColor = v_color * u_colorMult;
}
```

JavaScript string version:
```js
const fragmentShaderSource = `#version 300 es
in vec4 v_color;
uniform vec4 u_colorMult;
out vec4 outColor;
void main() {
	outColor = v_color * u_colorMult;
}`;
```

Compile the shaders.
```js
const createShader = (gl, type, source) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader));
	}

	return shader;
};

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
```

#### Link shaders
Link the shaders.
```js
const createProgram = (gl, vertexShader, fragmentShader) => {
	const program = gl.createProgram();
	[vertexShader, fragmentShader].forEach((shader) => gl.attachShader(program, shader));
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(gl.getProgramInfoLog(program));
	}

	return program;
};

const program = createProgram(gl, vertexShader, fragmentShader);
```

If you're using Umbra, you can skip creating the shaders and instead create the shader program directly from the source code.
```js
import { Program } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const program = Program.fromSource(gl, vertexShaderSource, fragmentShaderSource);
```

#### Get locations
Look up variable locations.
```js
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");
const colorMultUniformLocation = gl.getUniformLocation(program, "u_colorMult");
```

If you're using Umbra, this step has already been done for you.

#### Create buffers
TODO
