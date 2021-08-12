# About this Guide
This guide is heavily based on the one at [webgl2fundamentals](https://webgl2fundamentals.org/). It follows the same format and some of the more difficult to describe topics are copied almost verbatim. If you are looking to learn WebGL2 without the help of a framework, either of these guides should work fine (although the examples in this one will use modern JavaScript). The point of making this guide is to introduce Umbra's WebGL portion in a way that encourages utilizing it to its fullest extent.

# Introduction to WebGL2
WebGL is a rasterization engine. It draws points, lines, and triangles based on code you supply. Getting it to do anything else is up to you to provide code to use points, lines, and triangles to accomplish your task.

WebGL runs on your GPU, and therefore you must provide code that can be executed on a GPU. You provide that code in the form of pairs of functions called a vertex shader and a fragment shader. Each is written in a strictly-typed C-like language called GLSL. Paired together, they are called a shader program.

A vertex shader's job is to compute vertex positions. Based on the positions the function outputs, WebGL can rasterize various kinds of primitives (including points, lines, and triangles). When rasterizing these primitives, it calls the fragment shader to compute a color for each pixel being drawn.

Nearly all of the WebGL API is dedicated to setting up state for the shader program to run. For each thing you want to draw, you set up a bunch of state then execute the shader program by calling `gl.drawArrays` or `gl.drawElements`.

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

**Vertex shader:**
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

**Fragment shader:**
```glsl
#version 300 es

// Fragment shaders don't have a default precision so we need to pick one.
precision highp float;

// We must declare an output for the fragment shader.
out vec4 outColor;

void main() {
	outColor = vec4(0.314, 0.784, 0.471, 1);
}
```

**Canvas**
In order to draw on the screen, we need an HTML canvas element.
```html
<canvas id="canvas"></canvas>
<script>
	const canvas = document.querySelector("#canvas");
</script>
```

If you're using Umbra, this can be done with pure JavaScript.
```html
<script type="module">
	import { makeFullscreenCanvas } from "https://cdn.skypack.dev/@lakuna/umbra.js";

	const canvas = makeFullscreenCanvas();
</script>
```

**Rendering context**
In order to use WebGL2, we need to get the rendering context of the canvas.
```js
const gl = canvas.getContext("webgl2");
if (!gl) { throw new Error("WebGL2 is not supported by your browser."); }
```

**Compiling the shaders**
TODO