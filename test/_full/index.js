let umbra;
let pointer;
let camera;

window.onload = () => {
	umbra = new Umbra(setup, load, "Example", ["test.png"], 30);
	pointer = umbra.pointer;
	umbra.camera = new UCamera(new Bounds(new Vector2(), new Vector2(umbra.canvas.width * 2, umbra.canvas.height * 2))); // 2x scale camera.
	camera = umbra.camera;

	umbra.start();
}

const setup = () => {
	// Setup arrow keys.
	const moveCamera = (offset) => camera.bounds.translate(offset);
	new UKey(65).press = () => moveCamera(new Vector2(-10, 0)); // Left
	new UKey(87).press = () => moveCamera(new Vector2(0, -10)); // Up
	new UKey(68).press = () => moveCamera(new Vector2(10, 0)); // Right
	new UKey(83).press = () => moveCamera(new Vector2(0, 10)); // Down

	// TODO Add border lines to initial screen.
	new URect(new Bounds(new Vector2(100, 100), new Vector2(10, 10))).fillColor = "red";
	new UCircle(new Bounds(new Vector2(150, 100), new Vector2(10, 10))).fillColor = "green";
	new ULine(new Bounds(new Vector2(200, 100), new Vector2(200, 150))).lineColor = "blue";
	new UText("Hello, world!", new Bounds(new Vector2(100, 200), new Vector2())).fillColor = "purple";
	new USprite(new USpritesheet(umbra.assets["test.png"], new Vector2(750, 750)), new Bounds(new Vector2(100, 300), new Vector2(1100, 1300)));
}

const load = () => console.log("Load");
