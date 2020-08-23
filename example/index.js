let umbra;
let pointer;
let camera;
let testRect;

window.onload = () => {
	umbra = new Umbra(setup, load, "Example", [], 1);
	pointer = umbra.pointer;
	umbra.camera = new UCamera(new Bounds(new Vector2(), new Vector2(umbra.canvas.width / 2, umbra.canvas.height / 2))); // 2x scale camera.
	camera = umbra.camera;

	umbra.start();
}

const setup = () => {
	new UKey(37).press = () => moveCamera(new Vector2(-10, 0)); // Left
	new UKey(38).press = () => moveCamera(new Vector2(0, -10)); // Up
	new UKey(39).press = () => moveCamera(new Vector2(10, 0)); // Right
	new UKey(40).press = () => moveCamera(new Vector2(0, 10)); // Down

	testRect = new URect(new Bounds(new Vector2(100, 100), new Vector2(150, 150)));

	pointer.tap = logTestRect;
}

const load = () => console.log("Load");

const moveCamera = (offset) => camera.bounds.translate(offset);

const logTestRect = () => {
	rPos = camera.gBToS(testRect.bounds);
	console.log(`Test rectangle render position: (${rPos.min.x}, ${rPos.min.y}) - (${rPos.max.x}, ${rPos.max.y}).`);
}