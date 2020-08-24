let umbra;
let pointer;
let camera;
let testText;

window.onload = () => {
	umbra = new Umbra(setup, load, "Example", [], 30);
	pointer = umbra.pointer;
	umbra.camera = new UCamera(new Bounds(new Vector2(), new Vector2(umbra.canvas.width, umbra.canvas.height))); // 2x scale camera.
	camera = umbra.camera;

	umbra.start();
}

const setup = () => {
	new UKey(37).press = () => moveCamera(new Vector2(-10, 0)); // Left
	new UKey(38).press = () => moveCamera(new Vector2(0, -10)); // Up
	new UKey(39).press = () => moveCamera(new Vector2(10, 0)); // Right
	new UKey(40).press = () => moveCamera(new Vector2(0, 10)); // Down

	testText = new UText("Hello, world!");

	umbra.updates.push(followPointer)

	pointer.tap = tap;
}

const load = () => console.log("Load");

const moveCamera = (offset) => camera.bounds.translate(offset);

const followPointer = () => {
	testText.bounds = new Bounds(camera.sPToG(pointer.pos), new Vector2());
}

const tap = () => {
	console.log(`(${testText.bounds.min.x}, ${testText.bounds.min.y}) - (${testText.bounds.max.x}, ${testText.bounds.max.y})`)
}