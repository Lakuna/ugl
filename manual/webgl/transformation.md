# WebGL Transformation

## Translation
In order to avoid modifying buffers, we can use uniforms to translate all of the vertices in our vertex shader.
```glsl
#version 300 es

in vec4 a_position;

uniform vec2 u_translation;

void main() {
    gl_Position = a_position + u_translation;
}
```

## Rotation
Because a unit circle has a radius of 1, and multiplying a value by 1 returns itself, we can rotate our vertices by multiplying them by a point on the unit circle. A unit circle is a rotating 1.
```glsl
#version 300 es

in vec4 a_position;

uniform vec2 u_rotation;

void main() {
    gl_Position = vec2(
        a_position.x * u_rotation.y + a_position.y * u_rotation.x,
        a_position.y * u_rotation.y - a_position.x * u_rotation.x
    );
}
```

For any given angle, we can calculate the point on a unit circle using the sine and cosine.
```js
const angleInRadians = angleInDegrees * Math.PI / 180;

const sine = Math.sin(angleInRadians);   // x
const cosine = Math.cos(angleInRadians); // y
```

## Scale
Scale is similar to translation.
```glsl
#version 300 es

in vec4 a_position;

uniform vec2 u_scale;

void main() {
    gl_Position = a_position * u_scale;
}
```

Scaling by a negative number flips the geometry. Scaling takes place from `(0, 0)` in clip space coordinates.

## Matrices

### X-major order
Before we begin talking about matrices, you should know that there is a small difference between matrices in WebGL and matrices in normal linear algebra. In programming, a row typically goes from left to right, and a column goes from top to bottom. When we make a matrix in JavaScript, we do it like this (row-major order):
```js
const matrix = [
     0,  1,  2,  3,
     4,  5,  6,  7,
     8,  9, 10, 11,
    12, 13, 14, 15
];
```

However, math conventions for matrix math typically do things in columns (column-major order):
```js
const matrix = [
    0, 4,  8, 12,
    1, 5,  9, 13,
    2, 6, 10, 14,
    3, 7, 11, 15
];
```

Therefore, in the context of WebGL, rows are typically called "columns."
```js
const matrix = [
     0,  1,  2,  3, // Column 0
     4,  5,  6,  7, // Column 1
     8,  9, 10, 11, // Column 2
    12, 13, 14, 15  // Column 3
];
```

However, since this manual is written from the point-of-view of a programmer, we will still refer to rows as "rows." Therefore, if you decide to look up help on matrix math, know that you will probably have to use the transpose of any examples you find (flip them diagonally).

### Matrix math
Aside from bloating your code, an issue with translating, rotating, and scaling vertices separately is that the operations are order-dependent. The solution to this is to use matrices to apply transformations instead. For 2D programs, we use a 3x3 matrix.
```js
const matrix = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9
];
```

To do the math, we multiply the position down the columns of the matrix and add up the results. Our positions only have two values (`x` and `y`), but to do this math we need three values, so we use one for the third value. In the case of the above example, the result would look like this:
```
newX = x * 1 +    newY = x * 2 +    extra = x * 3 +
       y * 4 +           y * 5 +            y * 6 +
       1 * 7             1 * 8              1 * 9
```

### 2D examples

#### Translation
For example, a translation matrix looks like this:
```
 1,  0, 0,
 0,  1, 0,
tx, ty, 1
```
Where `tx` and `ty` are the amount we want to translate by.

The result of the transformation would be solved like:
```
newX = x *  1 +   newY = x *  0 +   extra = x * 0 +
       y *  0 +          y *  1 +           y * 0 +
       1 * tx            1 * ty             1 * 1
```

Since multiplication by 0 is always 0 and multiplication by 1 does nothing, we can simplify this operation to:
```
newX = x + tx;
newY = y + ty;
```

#### Rotation
A rotation matrix looks like this:
```
c, -s, 0,
s,  c, 0,
0,  0, 1
```
Where `c` is the cosine of our rotation in radians and `s` is the sine.

The result of the transformation would be solved like:
```
newX = x * c +    newY = x * -s +    extra = x * 0 +
       y * s +           y *  c +            y * 0 +
       1 * 0             1 *  0              1 * 1
```

We can simplify this operation to:
```
newX = x *  c + y * s;
newY = x * -s + y * c;
```

#### Scale
A scale matrix looks like this:
```
sx,  0, 0,
 0, sy, 0,
 0,  0, 1
```
Where `sx` and `sy` are the scale factors.

The result of the transformation would be solved like:
```
newX = x * sx +    newY = x *  0 +   extra = x * 0 +
       y *  0 +           y * sy +           y * 0 +
       1 *  0             1 *  0             1 * 1
```

We can simplify this operation to:
```
newX = x * sx;
newY = y * sy;
```

### Identity
An "identity matrix" is basically the "1" of matrices. Multiplying a matrix by identity returns the same matrix. A 3x3 identity matrix looks like this:
```
1 0 0
0 1 0
0 0 1
```

A 4x4 identity matrix looks like this:
```
1 0 0 0
0 1 0 0
0 0 1 0
0 0 0 1
```

Et cetera.

### Orthographic matrix
We can use the `Matrix.orthographic` method to convert from clip space to screen space. In an earlier example, we did this from within the shader like this:
```glsl
vec2 zeroToOne = position / resolution;
vec2 zeroToTwo = zeroToOne * 2.0;
vec2 clipSpace = zeroToTwo - 1.0;
gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
```

The first, second, and fourth steps are basically scale transformations, while the third is basically a translation. Therefore, the same result can be achieved with matrix math. This is the functionality that is built into the  `Matrix.orthographic` method in Umbra.

### Multiplying matrices
Matrices can be multiplied together in order to apply all of the transformations at once. The math for this is too bloated and complicated for the scope of this tutorial, so examples from now on will utilize the matrix math that is already built into Umbra. If you would like to learn in detail how more advanced matrix math works, you can try reading through the source code for Umbra or a tutorial on linear algebra.

In Umbra, the `Matrix` class represents a matrix. We can call methods on the `Matrix` class, such as `Matrix.rotate()`, to multiply the matrix by other matrices (and therefore apply transformations).

### Matrices example

#### Initialization step

##### Create the shaders
To apply a matrix to our vertices, simply multiply the vertices by the matrix. This vertex shader uses `vec4` for the vertices and `mat4` for the matrices because Umbra uses 3D points by default.
```glsl
#version 300 es

in vec4 a_position;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
    gl_Position = u_matrix * a_position;

    v_color = gl_Position * 0.5 + 0.5;
}
```

The JavaScript equivalent of this is:
```js
const vertexShaderSource = `#version 300 es
in vec4 a_position;
uniform mat4 u_matrix;
out vec4 v_color;
void main() {
    gl_Position = u_matrix * a_position;
    v_color = gl_Position * 0.5 + 0.5;
}`;
```

We will use the fragment shader from the varyings example because, since this shape will be moving, it better demonstrates the conversion of screen space to color space.
```glsl
#version 300 es

precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
    outColor = v_color;
}
```

The JavaScript equivalent of this is:
```js
const fragmentShaderSource = `#version 300 es
precision highp float;
in vec4 v_color;
out vec4 outColor;
void main() {
    outColor = v_color;
}`;
```

##### Create the canvas
```js
import { makeFullscreenCanvas } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const canvas = makeFullscreenCanvas();
```

##### Get the context
```js
const gl = canvas.getContext("webgl2");
if (!gl) { throw new Error("WebGL2 is not supported by your browser."); }
```

##### Create the program
```js
import { Program } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const program = Program.fromSource(gl, vertexShaderSource, fragmentShaderSource);
```

##### Create a buffer
```js
import { Buffer } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const positionBuffer = new Buffer(gl, new Float32Array([
    -300,  300,
    -300, -300,
     300, -300,
     300,  300
]));
```

##### Set an attribute
```js
import { Attribute, VAO } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const positionAttribute = new Attribute("a_position", positionBuffer, 2);
const vao = new VAO(program, [positionAttribute], [
    0, 1, 2,
    0, 2, 3
]);
```

#### Render step

##### Render loop
Remember to wrap the render step in a loop.
```js
const render = (time) => {
    requestAnimationFrame(render);

    // Render step...
};
requestAnimationFrame(render);
```

Note the addition of the `now` parameter. Whenever a function is called with `requestAnimationFrame`, the first (and only) parameter is the current time (based on the number of milliseconds since time origin). This parameter can be used to make animations smoother (not based on framerate).

##### Resize the canvas
```js
import { resizeCanvas } from "https://cdn.skypack.dev/@lakuna/umbra.js";

resizeCanvas(canvas);
```

##### Clear the canvas
```js
import { clearCanvas } from "https://cdn.skypack.dev/@lakuna/umbra.js";

clearCanvas(gl);
```

##### Set a uniform
Here we pass a matrix with an animation to prove that our matrix math is working.
```js
import { Matrix } from "https://cdn.skypack.dev/@lakuna/umbra.js";

program.use();

program.uniforms.get("u_matrix").value = new Matrix()
    .orthographic(0, canvas.clientWidth, canvas.clientHeight, 0, 1, 0) // Convert to screen space.
    .translate([canvas.clientWidth / 2, canvas.clientHeight / 2]) // Move to center of screen.
    .rotateZ(time * 0.001); // Rotate about the Z axis because our shape is on the XY plane.
```

##### Execute the program
```js
vao.draw();
```

#### Result
[This](https://codepen.io/lakuna/full/YzQzraE) is the above program.
