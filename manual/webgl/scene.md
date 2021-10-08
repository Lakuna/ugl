# Scene Graph
Umbra's scene graph is based on [Unity](https://unity.com/)'s.

A scene graph is a tree-like data structure, in which each node generates a matrix. Readers familiar with Unity will know that the Transform "Component" (which is used to generate the matrix) is a part of the "GameObject" (node). Umbra's functionality is similar, with GameObjects for nodes and Components attached to them containing scripts. However, the Transform Component is optional in Umbra, and the Scene in Umbra is itself a GameObject.

## A standard Umbra program.
A standard Umbra program begins by declaring the Umbra instance, which controls the events that Components use to run scripts.
```js
import { Umbra } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const u = new Umbra();
```
By default, Umbra will remove all other elements and styles on the page. If you would like to use a predefined canvas, pass it into the first parameter using a built-in JavaScript function such as `document.querySelector` or `document.getElementById`.

Next, we need to build a scene. First, declare a GameObject to be used as a scene.
```js
import { GameObject } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const scene = new GameObject();
```

Then create a new GameObject to go into the scene. For this example, we will be creating a new type of GameObject called a "Cube" so that we can graphically show the relationship between parents and children. This is similar to the idea of "Prefabs" in Unity.
```js
import { Geometry, VAO, Mesh, Component, Program } from "https://cdn.skypack.dev/@lakuna/umbra.js";

class Cube extends GameObject {
	// Define the geometry of a cube.
	static geometry = new Geometry(
		[-1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1],
		[0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1],
		[0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0],
		[0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]
	);

	static vertexShaderSource = `#version 300 es

	in vec4 a_position;
	in vec3 a_normal;

	uniform mat4 u_matrix;

	out vec4 v_color;

	void main() {
		gl_Position = u_matrix * a_position;
		v_color = vec4(a_normal, 1) * 0.5 + 0.5;
	}`;

	static fragmentShaderSource = `#version 300 es

	precision highp float;

	in vec4 v_color;

	out vec4 outColor;

	void main() {
		outColor = v_color;
	}`;

	constructor(parent, program) {
		super(parent);

		// Create a VAO for each cube.
		this.vao = VAO.fromGeometry(program, Cube.geometry, "a_position", null, "a_normal");

		// Attach a Mesh Component to each Cube. Mesh extends Transform.
		this.mesh = new Mesh(this, 0, this.vao);

		// Add a component to rotate each Cube for demonstration purposes.
		new Component(this)[Component.events.UPDATE] = (u) => {
			this.mesh.rotation.x += u.fps * 0.004;
			this.mesh.rotation.y += u.fps * 0.007;
		};
	}
}

// Create a program to draw all of our cubes with.
const program = Program.fromSource(u.gl, Cube.vertexShaderSource, Cube.fragmentShaderSource);
```

Naturally, we also need to tell Umbra to draw the cubes we create. We can do this by creating a "Renderer" Component.
```js
import { resizeCanvas, clearCanvas } from "https://cdn.skypack.dev/@lakuna/umbra.js";

class Renderer extends Component {
	constructor(scene, camera) {
		super(scene, -1);

		// Add an update event. This is similar to overriding the "update" method on Unity MonoBehaviour.
		this[Component.events.UPDATE] = (u) => {
			resizeCanvas(u.gl.canvas);
			u.gl.enable(u.gl.CULL_FACE);
			u.gl.enable(u.gl.DEPTH_TEST);
			clearCanvas(u.gl);

			for (const mesh of Mesh.getRenderList(scene, camera)) {
				mesh.vao.program.use();
				mesh.vao.program.uniforms.get("u_matrix").value = mesh.matrix;
				mesh.vao.draw();
			}
		};
	}
}
```
The Renderer Component uses the `Mesh.getRenderList` function to decide the order in which to draw all Meshes. This function takes into account the distance of the Mesh from the Camera (if one is supplied), the transparency of the object, the program used to draw the object, and more. Notice that this Renderer assumes that the only uniform that every shader in your game uses is called `u_matrix` and expects the matrix of a Mesh. Obviously, you wouldn't want to use this exact implementation of a Renderer for every game.

Finally, let's put together the objects in the scene...
```js
import { Camera, Vector } from "https://cdn.skypack.dev/@lakuna/umbra.js";

const camera = new Camera({ object: new GameObject(scene) });
camera.z -= 5; // Move the camera back a little bit to put the cubes in view.

const leftCube = new Cube(scene, program);
leftCube.x -= 5;

const rightCube = new Cube(scene, program);
rightCube.x += 5;

const tinyCube = new Cube(rightCube, program);
tinyCube.scale = new Vector(0.5, 0.5, 0.5);
tinyCube.y += 5;

const renderer = new Renderer(scene, camera);
```

...and make the scene active in order to start the program.
```js
u.scene = scene;
```

### Result
TODO
