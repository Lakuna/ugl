# WebGL Indices
In previous examples, we used `gl.drawArrays` to tell WebGL to draw to the screen. The alternative to this is `gl.drawElements`, which allows us to use the same vertices multiple times in a shape without re-defining them. For example, you could draw a rectangle using `gl.drawArrays` with 6 points (2 repeats):
```js
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	left, top,
	left, bottom,
	right, bottom,
	left, top,
	right, bottom,
	right, top
]), gl.STATIC_DRAW);
```

Or we could draw the same rectangle using `gl.drawElements` with 4 points:
```js
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	left, top,
	left, bottom,
	right, bottom,
	right, top
]), gl.STATIC_DRAW);
```

In order to tell WebGL which vertices to repeat, we supply a special type of buffer with the `gl.ELEMENT_ARRAY_BUFFER` binding point.
```js
// The index buffer must be created while the VAO it applies to is active.

const indexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([
	0, 1, 2,
	0, 2, 3
]), gl.STATIC_DRAW);
```

The `ELEMENT_ARRAY_BUFFER` must be created while the VAO it applies to is active because, unlike `ARRAY_BUFFER` which is global state, the `ELEMENT_ARRAY_BUFFER` is part of the VAO. Once we create the `ELEMENT_ARRAY_BUFFER`, any time we bind its VAO the indices will also be bound.

## Indices example
Start this example from the varyings example in the introduction to WebGL2 article.

### Initialization step

#### Modify positions
First, we'll change our positions to the corners of a rectangle.
```js
const positions = [
	-1, 1,
	-1, -1,
	1, -1,
	1, 1
];
```

#### Add indices
Then, after we bind our buffers to our VAO, we'll add the code to create the `ELEMENT_ARRAY_BUFFER`.
```js
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
	0, 1, 2,
	0, 2, 3
]), gl.STATIC_DRAW);
```

For Umbra users, you can instead pass the buffer values into the VAO's constructor.
```js
const vao = new VAO(program, [positionAttribute], [
	0, 1, 2,
	0, 2, 3
]);
```

### Render step

#### Execute the program
Switch the `gl.drawArrays` call to a `gl.drawElements` call.
```js
gl.drawElements(
	gl.TRIANGLES, // Primitive type
	6, // Count
	gl.UNSIGNED_SHORT, // Index type
	0 // Offset
);
```

For Umbra users, you don't need to change anything.

### Result
[This](https://codepen.io/lakuna/full/NWgKqvZ) is the above program without Umbra, and [this](https://codepen.io/lakuna/full/gORYpXQ) is the above program with Umbra.
