# WebGL Textures
To draw images in WebGL, we need to use textures. Similarly to the way WebGL expects clip space coordinates instead of pixels (screen space coordinates), it expects texture coordinates when reading a texture. Texture coordinates go from 0 to 1.

## Plane
```js
// Values for an XY plane.
// Clip space coordinates go from (-1, -1) (bottom left) to (1, 1) (top right).
// Notice that the vertices go counter-clockwise so that this is a front face.
const planeVertexPositions = [
	-1,  1, 0, // Top left
	-1, -1, 0, // Bottom left
	 1, -1, 0, // Bottom right
	 1,  1, 0 // Top right
];

// Normals are used primarily for lighting. They will be covered in more detail later.
// Although they are all the same for a plane, they still go counter-clockwise.
const planeNormals = [
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,
	0, 0, 1
];

// Texture coordinates go from (0, 0) (bottom left) to (1, 1) (top right).
// Notice that the texture coordinates go counter-clockwise and match the position of the vertex.
const planeTextureCoordinates = [
	0, 1,
	0, 0,
	1, 0,
	1, 1
];

// We use indices so that we don't have to repeat values.
const planeIndices = [
	0, 1, 2,
	0, 2, 3
];
```

## Texture lookup
The typical use of texture coordinates is to pass them to the fragment shader as a varying...
```glsl
in vec2 a_texcoord;

out vec2 v_texcoord;

void main() {
	v_texcoord = a_texcoord;
}
```

...and then use them to look up colors from a texture.
```glsl
uniform sampler2D u_image;

in vec2 v_texcoord;

out vec4 outColor;

void main() {
	outColor = texture(u_image, v_texcoord);
}
```

## Create a texture
In vanilla WebGL, creating a texture looks something like this:
```js
// Create the texture.
const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0 + 0); // Use texture unit 0.
gl.bindTexture(gl.TEXTURE_2D, texture);

// Fill it with a 1x1 blue pixel.
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
```

In Umbra, the `Texture` class handles all of the specifics for us.
```js
import { Texture, Color } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const texture = Texture.fromColor(gl, new Color(0x0000FF));
```

## Textures example

### Initialization step

#### Create shaders
```glsl
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec2 v_texcoord;

void main() {
	gl_Position = u_matrix * a_position;

	v_texcoord = a_texcoord;
}
```

```js
const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
uniform mat4 u_matrix;
out vec2 v_texcoord;
void main() {
	gl_Position = u_matrix * a_position;
	v_texcoord = a_texcoord;
}`;
```

```glsl
#version 300 es

precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
	outColor = texture(u_texture, v_texcoord);
}
```

```js
const fragmentShaderSource = `#version 300 es
precision highp float;
in vec2 v_texcoord;
uniform sampler2D u_texture;
out vec4 outColor;
void main() {
	outColor = texture(u_texture, v_texcoord);
}`;
```

#### Boilerplate
This boilerplate code has been written multiple times in previous examples, so I'm going to lump it all together from now on.
```js
import { makeFullscreenCanvas, Program } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const canvas = makeFullscreenCanvas();
const gl = canvas.getContext("webgl2");
if (!gl) { throw new Error("WebGL2 is not supported by your browser."); }
const program = Program.fromSource(gl, vertexShaderSource, fragmentShaderSource);
```

#### Create geometry
```js
import { Geometry, VAO } from "https://cdn.skypack.dev/@lakuna/umbra.js";

// Put the plane data from above here.

const plane = new Geometry(planeVertexPositions, planeTextureCoordinates, planeNormals, planeIndices);
const vao = VAO.fromGeometry(program, plane, "a_position", "a_texcoord", null);
```

#### Create texture
```js
import { Texture, Color } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const texture = Texture.fromColor(gl, new Color(0x0000FF));
```

### Render step

#### Boilerplate
This boilerplate code has been explained in previous examples, so I'm going to lump it all together from now on.
```js
import { resizeCanvas, clearCanvas, Matrix } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const render = (time) => {
	requestAnimationFrame(render);

	resizeCanvas(canvas);
	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);
	clearCanvas(gl);
}
requestAnimationFrame(render);
```

#### Set uniforms and draw
In order to use a texture in a uniform, you would usually have to bind the texture unit you used when you created the texture. Umbra keeps track of this information for you, so you can just assign the `Texture` object.
```js
program.use();

program.uniforms.get("u_matrix").value = new Matrix(); // Not using any transforms.
program.uniforms.get("u_texture").value = texture;

vao.draw();
```

### Result
[This](https://codepen.io/lakuna/full/powvvYZ) is the result of the above example.

## Loading an image
If we'd like to load an image into the texture, we have to do so asynchronously.
```js
const image = new Image();
image.addEventListener("load", () => {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.generateMipmap(gl.TEXTURE_2D);
});
image.src = "https://docs.umbra.lakuna.pw/manual/asset/rgb.png";
```

Umbra also handles image loading for us, including CORS (see below).
```js
import { Texture } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const texture = Texture.fromImage(gl, "https://docs.umbra.lakuna.pw/manual/asset/rgb.png");
```

### CORS
[Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) allows you to include images from other domains than the one your WebGL program is on. In order to activate it, you must set the `crossOrigin` property of your image before requesting it (by setting its `src`).
```js
image.crossOrigin = "";
image.src = "https://docs.umbra.lakuna.pw/manual/asset/rgb.png";
```

### Images example

#### Initialization step
The only difference between this example and the last one is that we use the static `Texture.fromImage` method to get the texture.
```js
const texture = Texture.fromImage(gl, "https://docs.umbra.lakuna.pw/manual/asset/rgb.png");
```

#### Result
[This](https://codepen.io/lakuna/full/ZEyYQBx) is the example above.

## Using part of a texture
By changing our texture coordinates, we can use a part of a texture. You can get a specific pixel using the following formulas:
```js
const texcoordX = pixelCoordX / (width - 1);
const texcoordY = pixelCoordY / (height - 1);
```

If you try to use coordinates outside of the 0 to 1 range, the texture will repeat by default. In Umbra, this functionality is configurable through properties on the `Texture` class. These properties also allow you to choose whether or not to generate a mipmap and how precise to make it, among other things.

### Texture atlas example
A texture atlas is when you put multiple textures into the same file and use texture coordinates to access them. This can be useful for applying different textures to each side of a shape.

#### Initialization step

##### Create shaders
```glsl
#version 300 es

in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec2 v_texcoord;

void main() {
    gl_Position = u_matrix * a_position;

    v_texcoord = a_texcoord;
}
```

```js
const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
uniform mat4 u_matrix;
out vec2 v_texcoord;
void main() {
    gl_Position = u_matrix * a_position;
    v_texcoord = a_texcoord;
}`;
```

```glsl
#version 300 es

precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
    outColor = texture(u_texture, v_texcoord);
}
```

```js
const fragmentShaderSource = `#version 300 es
precision highp float;
in vec2 v_texcoord;
uniform sampler2D u_texture;
out vec4 outColor;
void main() {
    outColor = texture(u_texture, v_texcoord);
}`;
```

##### Boilerplate
```js
import { makeFullscreenCanvas, Program } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const canvas = makeFullscreenCanvas();
const gl = canvas.getContext("webgl2");
if (!gl) { throw new Error("WebGL2 is not supported by your browser."); }
const program = Program.fromSource(gl, vertexShaderSource, fragmentShaderSource);
```

##### Create geometry
Here, we're using a modified version of the cube geometry from the 3D article. The only thing that's changing is the texture coordinates.
```js
import { Geometry, VAO } from "https://cdn.skypack.dev/@lakuna/umbra.js";

// Cube values go here.
const cubeTextureCoordinates = [
    // Front
    0, 99 / 199,
    0, 0,
    99 / 299, 0,
    99 / 299, 99 / 199,

    // Back
    100 / 299, 99 / 199,
    100 / 299, 0,
    199 / 299, 0,
    199 / 299, 99 / 199,

    // Right
    200 / 299, 99 / 199,
    200 / 299, 0,
    1, 0,
    1, 99 / 199,

    // Left
    0, 1,
    0, 100 / 199,
    99 / 299, 100 / 199,
    99 / 299, 1,

    // Top
    100 / 299, 1,
    100 / 299, 100 / 199,
    199 / 299, 100 / 199,
    199 / 299, 1,

    // Bottom
    200 / 299, 1,
    200 / 299, 100 / 199,
    1, 100 / 199,
    1, 1
];

const atlasCube = new Geometry(cubeVertexPositions, cubeTextureCoordinates, cubeNormals, cubeIndices);
const vao = VAO.fromGeometry(program, atlasCube, "a_position", "a_texcoord", null);
```

##### Create texture
```js
import { Texture } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const texture = Texture.fromImage(gl, "https://docs.umbra.lakuna.pw/manual/asset/rgb atlas.png");
```

#### Render step

##### Boilerplate
```js
import { resizeCanvas, clearCanvas, Matrix } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const render = (time) => {
	requestAnimationFrame(render);

	resizeCanvas(canvas);
	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);
	clearCanvas(gl);
}
requestAnimationFrame(render);
```

##### Set uniforms and draw
```js
program.use();

camera.aspectRatio = canvas.clientWidth / canvas.clientHeight; // Update the camera's aspect ratio in case the canvas changed dimensions.

program.uniforms.get("u_matrix").value = new Matrix(); // Not using any transforms.
program.uniforms.get("u_texture").value = texture;

vao.draw();
```

#### Result
[This](https://codepen.io/lakuna/full/vYZELjN) is the above example.

## Image processing
Before we get started with image processing, look over [this](https://codepen.io/lakuna/full/JjJoKbr) code, which will serve as the base for the examples below. It is a picture of my cat Dopey, which maintains its 16:9 aspect ratio regardless of canvas size.

### Color swap
By adding `.bgra` to the end of our `outColor` setter in the fragment shader, we can swap red and blue in the image.
```glsl
void main() {
	outColor = texture(u_texture, v_texcoord).bgra;
}
```

View the result [here](https://codepen.io/lakuna/full/JjJoKLL).

### Convolution kernel
A convolution kernel can be used to reference other pixels in a fragment shader. A convolution kernel is just a 3x3 (in this case) matrix in which each entry represents how much to multiply the 8 pixels around the pixel we are rendering.
```glsl
#version 300 es

precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;
uniform float u_kernel[9];
uniform float u_kernelWeight;

out vec4 outColor;

void main() {
	vec2 onePixel = vec2(1) / vec2(textureSize(u_texture, 0));

	vec4 colorSum = 
		texture(u_texture, v_texcoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
		texture(u_texture, v_texcoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
		texture(u_texture, v_texcoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
		texture(u_texture, v_texcoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
		texture(u_texture, v_texcoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
		texture(u_texture, v_texcoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
		texture(u_texture, v_texcoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
		texture(u_texture, v_texcoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
		texture(u_texture, v_texcoord + onePixel * vec2( 1,  1)) * u_kernel[8];
	outColor = vec4((colorSum / u_kernelWeight).rgb, 1);
}
```

In JavaScript, we need to supply the kernel and its weight.
```js
// Initialization step
const kernel = new Matrix(
	-5, 0, 0,
	 0, 0, 0,
	 0, 0, 5
);
const kernelWeight = Math.max(kernel.reduce((a, b) => a + b), 1);

// Render step
program.uniforms.get("u_kernel[0]").value = kernel;
program.uniforms.get("u_kernelWeight").value = kernelWeight;
```

[Here](https://codepen.io/lakuna/full/bGRNeJE) is this example.

There are a ton of things that can be done with convolution kernels. The example above uses an edge detection kernel. Below are some alternatives.

#### Normal
```js
const kernel = new Matrix(
	0, 0, 0,
	0, 1, 0,
	0, 0, 0
);
```

#### Gaussian blur
```js
const kernel = new Matrix(
	0.045, 0.122, 0.045,
	0.122, 0.332, 0.122,
	0.045, 0.122, 0.045
);
```
```js
const kernel = new Matrix(
	1, 2, 1,
	2, 4, 2,
	1, 2, 1
);
```
```js
const kernel = new Matrix(
	0, 1, 0,
	1, 1, 1,
	0, 1, 0
);
```

#### Unsharpen
```js
const kernel = new Matrix(
	-1, -1, -1,
	-1,  9, -1,
	-1, -1, -1
);
```

#### Sharpness
```js
const kernel = new Matrix(
	 0, -1,  0,
	-1,  5, -1,
	 0, -1,  0
);
```

#### Sharpen
```js
const kernel = new Matrix(
	-1, -1, -1,
	-1, 16, -1,
	-1, -1, -1
);
```

#### Edge detect
```js
const kernel = new Matrix(
	-0.125, -0.125, -0.125,
	-0.125,      1, -0.125,
	-0.125, -0.125, -0.125
);
```
```js
const kernel = new Matrix(
	-1, -1, -1,
	-1,  8, -1,
	-1, -1, -1
);
```
```js
const kernel = new Matrix(
	-5, 0, 0,
	 0, 0, 0,
	 0, 0, 5
);
```
```js
const kernel = new Matrix(
	-1, -1, -1,
	 0,  0,  0,
	 1,  1,  1
);
```
```js
const kernel = new Matrix(
	-1, -1, -1,
	 2,  2,  2,
	-1, -1, -1
);
```
```js
const kernel = new Matrix(
	-5, -5, -5,
	-5, 39, -5,
	-5, -5, -5
);
```

#### Sobel horizontal
```js
const kernel = new Matrix(
	 1,  2,  1,
	 0,  0,  0,
	-1, -2, -1
);
```

#### Sobel vertical
```js
const kernel = new Matrix(
	1, 0, -1,
	2, 0, -2,
	1, 0, -1
);
```

#### Previt horizontal
```js
const kernel = new Matrix(
	 1,  1,  1,
	 0,  0,  0,
	-1, -1, -1
);
```

#### Previt vertical
```js
const kernel = new Matrix(
	1, 0, -1,
	1, 0, -1,
	1, 0, -1
);
```

#### Box blur
```js
const kernel = new Matrix(
	0.111, 0.111, 0.111,
	0.111, 0.111, 0.111,
	0.111, 0.111, 0.111
);
```

#### Triangle blur
```js
const kernel = new Matrix(
	0.0625, 0.125, 0.0625,
	 0.125,  0.25,  0.125,
	0.0625, 0.125, 0.0625
);
```

#### Emboss
```js
const kernel = new Matrix(
	-2, -1, 0,
	-1,  1, 1,
	 0,  1, 2
);
```

## Framebuffers
In order to use multiple effects on an image, we can use framebuffers. The way this works is that we create two more *work* textures and render to each texture in turn, applying the next effect each time. A framebuffer isn't actually a type of buffer; it's a list of attachments. By attaching a texture to a framebuffer, we can render into that texture.
```js
import { Framebuffer } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const framebuffer1 = new Framebuffer({ gl, size: new Vector(1260, 720) });
const framebuffer2 = new Framebuffer({ gl, size: new Vector(1260, 720) });
```

Whenever there is a framebuffer bound, draw calls draw to that framebuffer instead of the canvas. In order to draw to the canvas after drawing to framebuffers, make sure to set the current framebuffer to null. This can be done using the `Framebuffer.unbind` static method with Umbra.
```js
Framebuffer.unbind(gl);
```
Chances are, you'll never need to manage binding framebuffers during the render step because Umbra's `VAO.draw` method automatically handles that.

A program which utilizes the above technique to apply two kernels can be seen [here](https://codepen.io/lakuna/full/rNweWOG). You'll notice that `VAO.draw` is called three times - once for each framebuffer and once for the canvas, and that each of these draw calls has different uniforms.

### Render to a texture
TODO

## Data textures
Instead of downloading an image and making a texture from it, we can make textures from data that we supply directly from JavaScript.
```js
import { Texture, Vector } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const texture = new Texture({
	gl,

	// Supply values for a texture.
	data: new Uint8Array([
		32, 64, 96, 128,
		160, 192, 224, 255
	]),

	// Don't generate mips.
	generateMipmap: false,

	// Only pull one value at a time.
	unpackAlignment: 1,

	// Allow us to use textures of any size so we don't need mips.
	minFilter: gl.NEAREST,
	magFilter: gl.NEAREST,

	// Texture is 4 columns and 2 rows of pixels.
	size: new Vector(4, 2),

	// The data we're supplying is copied for the red, green, and blue values.
	format: gl.LUMINANCE
});
```

[Here](https://codepen.io/lakuna/full/YzQWVmm) is the above in action. It's identical to the first texture example, except with the texture replaced with the above code.

[Here](TODO) is a way cooler example which uses OpenSimplex noise.
