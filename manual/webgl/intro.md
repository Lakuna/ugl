# Introduction to WebGL2

## About this Guide
This guide is heavily based on the one at [webgl2fundamentals](https://webgl2fundamentals.org/). It follows the same format and some of the more difficult to describe topics are copied almost verbatim. If you are looking to learn WebGL2 without the help of a framework, either of these guides should work fine (although the examples in this one will use modern JavaScript). The point of making this guide is to introduce Umbra's WebGL portion in a way that encourages utilizing it to its fullest extent.

All of the CodePen examples in my WebGL tutorials can be found in the collection [here](https://codepen.io/collection/KpPxqB).

## WebGL
WebGL is a rasterization engine. It draws points, lines, and triangles based on code you supply. Getting it to do anything else is up to you to provide code to use points, lines, and triangles to accomplish your task.

WebGL runs on your GPU, and therefore you must provide code that can be executed on a GPU. You provide that code in the form of pairs of functions called a vertex shader and a fragment shader. Each is written in a strictly-typed C-like language called GLSL. Paired together, they are called a shader program.

A vertex shader's job is to compute vertex positions. Based on the positions the function outputs, WebGL can rasterize various kinds of primitives (including points, lines, and triangles). When rasterizing these primitives, it calls the fragment shader to compute a color for each pixel being drawn.

Nearly all of the WebGL API is dedicated to setting up state for the shader program to run. For each thing you want to draw, you set up a bunch of state then execute the shader program by calling `gl.drawArrays` or `gl.drawElements`.

## Providing data to the GPU
Any data you want the shader program to have access to must be provided to the GPU. There are four ways for a shader to receive data:
1. **Attributes (Buffers, and Vertex Arrays)**

**Buffers** are arrays of binary data you upload to the GPU. Buffers are typically used to store things like positions, normals, texture coordinates, and vertex colors, although you can put anything you want in them. **Attributes** are used to specify how to pull data out of your buffers and provide them to your vertex shader. The state of attributes, which buffers to use with each one, and how to pull out data from those buffers is collected into a **vertex array object (VAO)**.

2. **Uniforms**

Uniforms are effectively global variables that you set before you execute your shader program.

3. **Textures**

Textures are arrays of data that you can randomly access in your shader program. The most common thing to put in a texture is image data, but textures are just data and can just as easily contain something other than colors.

4. **Varyings**

Varyings are a way for a vertex shader to pass data to a fragment shader. Depending on what is being rendered, the values set on a varying by a vertex shader will be interpolated while executing the fragment shader (which is why they are called "varyings").

## Hello, world!

WebGL only cares about two things: clip space coordinates and colors. Your job as a programmer using WebGL is to provide WebGL with those two things. You provide your two shaders to do this - a vertex shader which supplies clip space coordinates, and a fragment shader which supplies colors.

Clip space coordinates always go from -1 to +1 no matter what size your canvas is.

### Initialization step

#### Create the shaders
Vertex shader:
```glsl
#version 300 es

// An attribute is an input to a vertex shader. It will receive data from a buffer.
in vec4 a_position;

// All shaders have a main function.
void main() {
	// gl_Position is a special variable that a vertex shader is responsible for setting.
	gl_Position = a_position;
}
```

Fragment shader:
```glsl
#version 300 es

// Fragment shaders don't have a default precision so we need to pick one.
precision highp float;

// We must declare an output for the fragment shader.
out vec4 outColor;

void main() {
	// Here, we're just setting the output to a color.
	outColor = vec4(0.314, 0.784, 0.471, 1);
}
```

#### Create the canvas
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

#### Create the rendering context
In order to use WebGL2, we need to get the rendering context of the canvas.
```js
const gl = canvas.getContext("webgl2");
if (!gl) { throw new Error("WebGL2 is not supported by your browser."); }
```

#### Compiling the shaders
Next, we need to compile the shaders to put them on the GPU. First, declare them as strings.
```js
const vertexShaderSource = `#version 300 es
in vec4 a_position;
void main() {
	gl_Position = a_position;
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
	outColor = vec4(0.314, 0.784, 0.471, 1);
}`;
```

Note that the `#version 300 es` line must be the **very first line** of your shader. There cannot be empty lines or comments before it. This line tells WebGL2 that you want to use the shader language called "GLSL ES 3.00". If you don't put that as the very first line, the shader language defaults to WebGL1's GLSL ES 1.00.

After we declare the strings, we can create a shader, upload the GLSL source, and compile the shader.
```js
const createShader = (gl, type, source) => {
	// Create the shader.
	const shader = gl.createShader(type);

	// Assign the source code to the shader.
	gl.shaderSource(shader, source);

	// Compile the shader.
	gl.compileShader(shader);

	// Check for compilation errors.
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader));
	}

	return shader;
};

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
```

If you're using Umbra, you can instead use the `Shader` constructor.
```js
import { Shader } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const vertexShader = new Shader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
```

#### Linking the shaders
Once we create the two shaders, we can link them together into a shader program.
```js
const createProgram = (gl, vertexShader, fragmentShader) => {
	// Create the shader program.
	const program = gl.createProgram();

	// Attach the shaders to the shader program.
	[vertexShader, fragmentShader].forEach((shader) => gl.attachShader(program, shader));

	// Link the shader program.
	gl.linkProgram(program);

	// Check for linking errors.
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(gl.getProgramInfoLog(program));
	}

	return program;
};

const program = createProgram(gl, vertexShader, fragmentShader);
```

If you're using Umbra, you can instead use the `Program` constructor.
```js
import { Program } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const program = new Program(vertexShader, fragmentShader);
```

Using Umbra, you can also choose to cut out the shader step entirely by using the `Program.fromSource` static method.
```js
import { Program } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const program = Program.fromSource(gl, vertexShaderSource, fragmentShaderSource);
```

#### Getting attribute locations
Now that we've created a GLSL program on the GPU, we need to supply data to it. In this case, our only input is `a_position` (which is an attribute). The first thing to do is to look up the location of the attribute for the program we just created.
```js
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
```

If you're using Umbra, the `Program` constructor has already done this for you.
```js
console.log(program.attributes.get("a_position").location);
```

#### Creating a buffer
Attributes get their data from buffers, so we need to create a buffer.
```js
const positionBuffer = gl.createBuffer();
```

WebGL allows us to manipulate many WebGL resources on global "bind points". You can think of bind points as internal global variables inside of WebGL. First you bind a resource to a bind point, then all other functions refer to the resource through the bind point.
```js
// Bind the new buffer we created to the bind point called "ARRAY_BUFFER".
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
```

Now we can put data in the buffer by referencing it through the bind point.
```js
// Three two-dimensional points.
const positions = [
	0, 0,
	0, 0.5,
	0.7, 0
];

// Access the buffer through the bind point.
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
```

Notice that we create a `Float32Array` instead of passing in an array of numbers. This is because WebGL requires "strongly typed" data.

The last argument, `gl.STATIC_DRAW`, is a hint to WebGL about how we'll use the data. WebGL can try to use that hint to optimize certain things. `gl.STATIC_DRAW` hints that we are not likely to change this data much.

If you're using Umbra, you can use the `Buffer` constructor instead of all of the above.
```js
import { Buffer } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const positionBuffer = new Buffer(gl, new Float32Array([
	0, 0,
	0, 0.5,
	0.7, 0
]));
```

#### Setting an attribute
Now that we've put the data in a buffer, we need to tell the attribute how to get data out of the buffer. First, we need to create a collection of attribute state called a vertex array object (VAO).
```js
const vao = gl.createVertexArray();
```

Then, we need to make it the current VAO so that all of our attribute settings are applied to it.
```js
gl.bindVertexArray(vao);
```

Now, we can set attributes in the VAO. First, we need to turn the attribute on so that WebGL knows that we want to get data out of a buffer. Otherwise, the attribute would have a constant value.
```js
gl.enableVertexAttribArray(positionAttributeLocation);
```

Then, we can specify how to pull the data out.
```js
gl.vertexAttribPointer(
	positionAttributeLocation,
	2, // Size; tells WebGL that we want to pull out 2 components per iteration.
	gl.FLOAT, // Type; tells WebGL that the data is stored as 32-bit floating-point values.
	false, // Normalize; tells WebGL whether to normalize the data.
	0, // Stride*; tells WebGL how far to move forward each iteration to get to the next position.
	0 // Offset; setting this to 0 tells WebGL to start at the beginning of the buffer.
);

// *Setting stride to 0 automatically calculates stride as if the data is tightly-packed (equal to size * sizeof(type)).
```

`gl.vertexAttribPointer` also binds the current `ARRAY_BUFFER` to the attribute; in other words, `positionBuffer` is now bound to the attribute at `positionAttributeLocation`. We can now bind something else to `ARRAY_BUFFER`, and the attribute will continue to use `positionBuffer`.

In our vertex shader, the `a_position` attribute is a `vec4`. Above, we set `size` to `2`. This will make the attribute get its former two values, `x` and `y`, from the buffer, while the latter two, `z` and `w`, will remain default (`0` and `1`, respectively).

If you're using Umbra, you can use the `Attribute` and `VAO` constructors instead.
```js
import { Attribute, VAO } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const positionAttribute = new Attribute("a_position", positionBuffer, 2);
const vao = new VAO(program, [positionAttribute]);
```

### Render step

#### Resizing the canvas
Before we draw, we should resize the canvas to match its display size. Just like images, canvases have two sizes: the number of pixels in them, and the size they are displayed. CSS determines the size the canvas is displayed.
```js
const resizeCanvas = (canvas) => {
	const displayWidth = canvas.clientWidth;
	const displayHeight = canvas.clientHeight;

	if (canvas.width != displayWidth || canvas.height != displayHeight) {
		canvas.width = displayWidth;
		canvas.height = displayHeight;

		return true;
	}

	return false;
};

resizeCanvas(canvas);
```

In Umbra, you can use an already-written utility method.
```js
import { resizeCanvas } from "https://cdn.skypack.dev/@lakuna/umbra.js";

resizeCanvas(canvas);
```

We need to tell WebGL how to convert from clip space values to screen space values (pixels).
```js
gl.viewport(0, 0, canvas.width, canvas.height);
```

#### Clearing the canvas
Tell WebGL what color it should clear to.
```js
gl.clearColor(0, 0, 0, 0); // Transparent (technically black).
```

Then, clear the canvas.
```js
gl.clear(gl.COLOR_BUFFER_BIT);
```

#### Executing the shader program
Tell WebGL which shader program to use.
```js
gl.useProgram(program);
```

Tell WebGL which set of buffers to use and how to pull data out of those buffers.
```js
gl.bindVertexArray(vao);
```

Execute the shader program.
```js
gl.drawArrays(
	gl.TRIANGLES, // Primitive type
	0, // Offset
	3 // Count; number of times to execute the vertex shader.
);
```

In this example, because the primitive type is set to `gl.TRIANGLES`, the fragment shader will run every time the vertex shader is run three times (one time for each point of a triangle).

If you're using Umbra, you can use this instead of all of the above.
```js
vao.draw();
```

#### Render loop
Everything in the render step should be executed every frame, ideally by using `requestAnimationFrame`.
```js
// Initialization step.

const render = () => {
	requestAnimationFrame(render);

	// Render step.
};
requestAnimationFrame(render);
```

### Result
[This](https://codepen.io/lakuna/full/BaRMqJw) is the above program without Umbra, and [this](https://codepen.io/lakuna/full/OJmdqRw) is the above program with Umbra.

## Screen space shader program
In the example above, we have to pass clip space values (-1 to +1; bottom to top; left to right) into the shader. For most users, it is more intuitive to use screen space (0 to screen size in pixels; top to bottom; left to right). In clip space, the origin (0, 0) is in the center of the screen. In screen space, the origin is at the top-left corner.

### Initialization step

#### Create the shader
Make a vertex shader which converts position data from screen space to clip space.
```glsl
#version 300 es

in vec2 a_position;

// A uniform is a global variable for WebGL.
uniform vec2 u_resolution;

void main() {
	// Convert the position from pixels to (0.0 to 1.0).
	vec2 zeroToOne = a_position / u_resolution;

	// Convert from (0.0 to 1.0) to (0.0 to 2.0).
	vec2 zeroToTwo = zeroToOne * 2.0;

	// Convert from (0.0 to 2.0) to (-1.0 to 1.0).
	vec2 clipSpace = zeroToTwo - 1.0;

	// Flip the Y-axis so that the top-left corner is the origin.
	vec2 clipSpaceFlipped = clipSpace * vec2(1, -1);

	gl_Position = vec4(clipSpace, 0, 1);
}
```

A simplified version of this in JavaScript looks like this:
```js
const vertexShaderSource = `#version 300 es
in vec2 a_position;
uniform vec2 u_resolution;
void main() {
	gl_Position = vec4((a_position / u_resolution * 2.0 - 1.0) * vec2(1, -1), 0, 1);
}`;
```

#### Getting uniform locations
Getting uniform locations is very similar to getting attribute locations.
```js
const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
```

Once again, Umbra has already done this step for us if we're using it.
```js
console.log(program.uniforms.get("u_resolution").location);
```

#### Drawing multiple primitives
Modify the position buffer to contain six points (twelve values) of pixel coordinates.
```js
const positions = [
	10, 20,
	80, 20,
	10, 30,
	10, 30,
	80, 20,
	80, 30
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
```

For Umbra users:
```js
import { Buffer } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const positionBuffer = new Buffer(gl, new Float32Array([
	10, 20,
	80, 20,
	10, 30,
	10, 30,
	80, 20,
	80, 30
]));
```

### Render step

#### Setting uniforms
Uniforms are set using methods of the form `gl.uniform[1234][uif][v]()`. These calls act on whichever program is currently active.

After we call `gl.useProgram` and before we draw the buffers, we can set uniforms.
```js
gl.useProgram(program);

gl.bindVertexArray(vao);

gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

gl.drawArrays(gl.TRIANGLES, 0, 6); // Also note that the count has been increased to include our new triangle.
```

The `gl.uniform[...]` call will be different for different types of uniforms.

Umbra automatically determines both the correct uniform setter function and the correct count variable for `gl.drawArrays`.
```js
program.use(); // Call program.use() now so that the correct program is being used before setting uniforms.

program.uniforms.get("u_resolution").value = [gl.canvas.width, gl.canvas.height];

vao.draw();
```

### Result
[This](https://codepen.io/lakuna/full/abWXgzv) is the above program without Umbra, and [this](https://codepen.io/lakuna/full/RwVvzWL) is the above program with Umbra.
