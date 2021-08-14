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
in vec3 a_normal;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec3 v_normal;
out vec2 v_texcoord;

void main() {
	gl_Position = u_matrix * a_position;

	v_normal = a_normal;
	v_texcoord = a_texcoord;
}
```

JavaScript string version:
```js
const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;
uniform mat4 u_matrix;
out vec3 v_normal;
out vec2 v_texcoord;
void main() {
	gl_Position = u_matrix * a_position;
	v_normal = a_normal;
	v_texcoord = a_texcoord;
}`;
```

Fragment shader:
```glsl
#version 300 es

precision highp float;

in vec3 v_normal;
in vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec3 u_reverseLightDirection;

out vec4 outColor;

void main() {
	outColor = texture(u_texture, v_texcoord);
	outColor.rgb *= dot(normalize(v_normal), u_reverseLightDirection);
}
```

JavaScript string version:
```js
const fragmentShaderSource = `#version 300 es
precision highp float;
in vec3 v_normal;
in vec2 v_texcoord;
uniform sampler2D u_texture;
uniform vec3 u_reverseLightDirection;
out vec4 outColor;
void main() {
	outColor = texture(u_texture, v_texcoord);
	outColor.rgb *= dot(normalize(v_normal), u_reverseLightDirection);
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
const normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");
const textureUniformLocation = gl.getUniformLocation(program, "u_texture");
const reverseLightDirectionUniformLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
```

If you're using Umbra, this step has already been done for you.

#### Create buffers
First, we need to define our vertex positions. This is a standard cube and a standard rectangle (XY plane).
```js
// Cube
const cubeVertexPositions = [
	// Front
	-1, 1, 1,
	-1, -1, 1,
	1, -1, 1,
	1, 1, 1,

	// Back
	1, 1, -1,
	1, -1, -1,
	-1, -1, -1,
	-1, 1, -1,

	// Right
	1, 1, 1,
	1, -1, 1,
	1, -1, -1,
	1, 1, -1,

	// Left
	-1, 1, -1,
	-1, -1, -1,
	-1, -1, 1,
	-1, 1, 1,

	// Top
	-1, 1, -1,
	-1, 1, 1,
	1, 1, 1,
	1, 1, -1,

	// Bottom
	-1, -1, 1,
	-1, -1, -1,
	1, -1, -1,
	1, -1, 1
];

const cubeNormals = [
	// Front
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,

	// Back
	0, 0, -1,
	0, 0, -1,
	0, 0, -1,
	0, 0, -1,

	// Right
	1, 0, 0,
	1, 0, 0,
	1, 0, 0,
	1, 0, 0,

	// Left
	-1, 0, 0,
	-1, 0, 0,
	-1, 0, 0,
	-1, 0, 0,

	// Top
	0, 1, 0,
	0, 1, 0,
	0, 1, 0,
	0, 1, 0,

	// Bottom
	0, -1, 0,
	0, -1, 0,
	0, -1, 0,
	0, -1, 0
];

const cubeTextureCoordinates = [
	// Front
	0, 1,
	0, 0,
	1, 0,
	1, 1,

	// Back
	0, 1,
	0, 0,
	1, 0,
	1, 1,

	// Right
	0, 1,
	0, 0,
	1, 0,
	1, 1,

	// Left
	0, 1,
	0, 0,
	1, 0,
	1, 1,

	// Top
	0, 1,
	0, 0,
	1, 0,
	1, 1,

	// Bottom
	0, 1,
	0, 0,
	1, 0,
	1, 1
];

const cubeIndices = [
	// Front
	0, 1, 2,
	0, 2, 3,

	// Back
	4, 5, 6,
	4, 6, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Left
	12, 13, 14,
	12, 14, 15,

	// Top
	16, 17, 18,
	16, 18, 19,

	// Bottom
	20, 21, 22,
	20, 22, 23
];

// Rectangle
const rectangleVertexPositions = [
	-1, 1, 1,
	-1, -1, 1,
	1, -1, 1,
	1, 1, 1
];

const rectangleNormals = [
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,
	0, 0, 1
];

const rectangleTextureCoordinates = [
	0, 1,
	0, 0,
	1, 0,
	1, 1
];

const rectangleIndices = [
	0, 1, 2,
	0, 2, 3
];
```

Then, we need to put that data into a buffer so that we can pass it to WebGL.
```js
// Cube
const cubePositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubePositionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexPositions), gl.STATIC_DRAW);

const cubeNormalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeNormals), gl.STATIC_DRAW);

const cubeTexcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexcoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeTextureCoordinates), gl.STATIC_DRAW);

// Rectangle
const rectanglePositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, rectanglePositionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectangleVertexPositions), gl.STATIC_DRAW);

const rectangleNormalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, rectangleNormalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectangleNormals), gl.STATIC_DRAW);

const rectangleTexcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, rectangleTexcoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectangleTextureCoordinates), gl.STATIC_DRAW);
```

Indices are a special type of buffer, so we'll use `cubeIndices` and `rectangleIndices` in just a moment.

#### Create VAOs
Now we will create a new VAO for each type of thing we want to draw.
```js
// Cube
const cubeVao = gl.createVertexArray();
gl.bindVertexArray(cubeVao);

gl.bindBuffer(gl.ARRAY_BUFFER, cubePositionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttributeLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(normalAttributeLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexcoordBuffer);
gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(texcoordAttributeLocation);

const cubeIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(cubeIndices), gl.STATIC_DRAW);

// Rectangle
const rectangleVao = gl.createVertexArray();
gl.bindVertexArray(rectangleVao);

gl.bindBuffer(gl.ARRAY_BUFFER, rectanglePositionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttributeLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, rectangleNormalBuffer);
gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(normalAttributeLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, rectangleTexcoordBuffer);
gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(texcoordAttributeLocation);

const rectangleIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectangleIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(rectangleIndices), gl.STATIC_DRAW);
```

Note that the index buffers are created as the other buffers are being set to the VAO. This is because buffers bound to `gl.ELEMENT_ARRAY_BUFFER` are special: they determine the order that values are pulled out of the other buffers.

#### Create textures
For the purposes of this example, we will be using a simple outline texture. The following string is that texture encoded to Base64, so that we can be sure the image will work in every environment.
```js
const outlineImageSource = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAIAAADwf7zUAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TS0VaRFpExCFDdbIgKuIoVSyChdJWaNXB5NIvaNKQtLg4Cq4FBz8Wqw4uzro6uAqC4AeIm5uToouU+L+k0CLGg+N+vLv3uHsHCM0KU82eCUDVakYqHhOzuVXR/wofQhjAIIISM/VEejED1/F1Dw9f76I8y/3cnyOo5E0GeETiOaYbNeIN4pnNms55nzjMSpJCfE48btAFiR+5Ljv8xrlos8Azw0YmNU8cJhaLXSx3MSsZKvE0cURRNcoXsg4rnLc4q5U6a9+TvzCQ11bSXKc5gjiWkEASImTUUUYFNURp1UgxkaL9mIt/2PYnySWTqwxGjgVUoUKy/eB/8LtbszA16SQFYoDvxbI+RgH/LtBqWNb3sWW1TgDvM3CldfzVJjD7SXqjo0WOgP5t4OK6o8l7wOUOMPSkS4ZkS16aQqEAvJ/RN+WA0C3Qt+b01t7H6QOQoa6Wb4CDQ2CsSNnrLu/u7e7t3zPt/n4ASt1ylxIM+ngAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBRMRGRZyIYKeAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAEaJJREFUeNrt2bERwDAIBMHHZUvF4yIU2CN2S/iIGxIAAGCMStLdhgAAgOvtvR8rAADAHAIAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAAAQACYAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAACAc5Wkuw0BAAD3X/9VPgAAADCIAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAAASACQAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAMA3AbDWsgIAAEwJABMAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAABAAJgAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAAAgAAABAAAAAAAIAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAAAQAAAAgAAAAAAEAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAAAQAAAAgAAAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAIAAAAQAAAAAACAAAAEAAAAIAAAAAABAAAACAAAAAAAQAAAAgAAABAAAAAAAIAAAAEAAAAIAAAAAABAAAACAAAAEAAAAAAAgAAABAAAACAAAAAAAQAAAAgAAAAAAEAAAACAAAAEAAAAIAAAAAABAAAAAAAAPAfLyiBENdcBN3eAAAAAElFTkSuQmCC";
```

You'll need to load the image into the texture asynchronously.
```js
const outlineTexture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0 + 0); // Use texture unit 0.
gl.bindTexture(gl.TEXTURE_2D, outlineTexture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0xFF, 0x0, 0xFF, 0xFF])); // Default to a single color.

// Load the image into the texture asynchronously.
const outlineImage = new Image();
image.addEventListener("load", () => {
	gl.bindTexture(gl.TEXTURE_2D, outlineTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, outlineImage);
	gl.generateMipmap(gl.TEXTURE_2D);
});
outlineImage.src = outlineImageSource;
```

If you're using Umbra, you can instead use the built-in functionality.
```js
import { Texture } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const outlineTexture = Texture.fromImage(outlineImageSource);
```