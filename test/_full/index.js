const FPS = 30;

let umbra;
let pointer;
let camera;

window.onload = () => {
	umbra = new Umbra(setup, undefined, "Example", ["test.png", "test.wav", "test.ttf"], FPS);
	pointer = umbra.pointer;
	umbra.camera = new UCamera(new Bounds(new Vector2(), new Vector2(umbra.canvas.width, umbra.canvas.height))); // 2x scale camera.
	camera = umbra.camera;

	umbra.start();
}

const setup = () => {
	// Setup arrow keys.
	setupArrows();

	// Border.
	new ULine(new Bounds(new Vector2(), new Vector2(umbra.canvas.width, 0))); // Top
	new ULine(new Bounds(new Vector2(), new Vector2(0, umbra.canvas.height))); // Left
	new ULine(new Bounds(new Vector2(umbra.canvas.width, umbra.canvas.height), new Vector2(umbra.canvas.width, 0))); // Right
	new ULine(new Bounds(new Vector2(umbra.canvas.width, umbra.canvas.height), new Vector2(0, umbra.canvas.height))); // Bottom

	// Basic objects.
	const rect = new URect(new Bounds(new Vector2(100, 300), new Vector2(120, 320)));
	const circle = new UCircle(new Bounds(new Vector2(150, 300), new Vector2(170, 0)));
	const line = new ULine(new Bounds(new Vector2(200, 300), new Vector2(220, 320)));
	const text = new UText("Hello, world!", new Bounds(new Vector2(250, 300), new Vector2()));
	const sprite = new USprite(new USpritesheet(umbra.assets["test.png"], new Vector2(750, 750)), new Bounds(new Vector2(100, 400), new Vector2(300, 600)));

	// Color basic objects.
	rect.fillColor = "red";
	circle.fillColor = "green";
	line.lineColor = "blue";
	text.fillColor = "purple";

	// Loaded font.
	text.font = "20px test";

	// Audio button.
	const beepButton = new URect(new Bounds(new Vector2(500, 300), new Vector2(660, 320)));
	const beepText = new UText("Click to Beep", beepButton.bounds, beepButton);
	beepText.fillColor = "black";
	const beep = umbra.assets["test.wav"];
	beepButton.onClick = () => beep.isPlaying = true;
}

const setupArrows = () => {
	// Define keys.
	const up = new UKey(38);
	const left = new UKey(37);
	const down = new UKey(40);
	const right = new UKey(39);

	// Set movement speed based on framerate.
	const speed = 1 / FPS;

	umbra.updates.push(() => {
		if (up.isDown) { camera.bounds.translate(new Vector2(0, -speed)); }
		if (left.isDown) { camera.bounds.translate(new Vector2(-speed, 0)); }
		if (down.isDown) { camera.bounds.translate(new Vector2(0, speed)); }
		if (right.isDown) { camera.bounds.translate(new Vector2(speed, 0)); }
	});
}
