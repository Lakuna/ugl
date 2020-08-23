let umbra;
let pointer;
let camera;
let testRect;
let circles = [];

window.onload = () => {
	umbra = new Umbra(setup, load, "Example");
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

	pointer.tap = tap;
}

const load = () => console.log("Load");

const moveCamera = (offset) => camera.bounds.translate(offset);

const tap = () => {
	sPos = camera.sPToG(pointer.pos);
	circles.push(new UCircle(new Bounds(sPos, new Vector2(sPos.x + 10, sPos.y + 10))));
	circles.forEach((circle) => circle.fillColor = "#" + Math.floor(Math.random() * 16777215).toString(16));
}