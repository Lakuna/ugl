let umbra;
let camera;

onload = () => {
	console.log("Starting Umbra v1.0 Test.");

	umbra = new Umbra(setup, load, "1.0 Test", ["blip.wav", "cubic.ttf", "example.json", "fire.png"]);
	camera = new UCamera(new Bounds(new Vector2(0, 0), new Vector2(innerWidth / 2, innerHeight / 2)));

	// Change camera.
	umbra.camera = camera;

	umbra.start();
}

const setup = () => {
	console.log(`Done loading in ${loadTicks} ticks.`);

	makeObjects(); // Test basic object types.

	umbra.state = main;
	umbra.isPaused = true;

	// Toggle pause key. Bound to "P" (80).
	const pKey = new UKey(80);
	pKey.onPress = () => {
		console.log("Unpausing...");
		umbra.isPaused = false;
	}
	pKey.onRelease = () => {
		console.log("Pausing...");
		umbra.isPaused = true;
		console.log(`Total ticks unpaused: ${mainTicks}.`);
	}

	setupCameraControls();
}

let mainTicks = 0;
const main = () => mainTicks++;

let loadTicks = 0;
const load = () => loadTicks++;

const makeObjects = () => {
	// Make basic shapes.
	const circle = new UCircle(new Bounds(new Vector2(100, 100), new Vector2(150, 150)));
	const line = new ULine(new Bounds(new Vector2(150, 100), new Vector2(200, 150)));
	const rect = new URect(new Bounds(new Vector2(200, 100), new Vector2(250, 150)));
	const text = new UText("Hello, world!", new Bounds(new Vector2(250, 100)));

	// Stylize basic shapes.
	circle.fillColor = "blue";
	circle.lineColor = "purple";
	circle.lineWidth = 5;
	line.lineColor = "red";
	line.lineWidth = 10;
	line.layer = 1; // Corner should display above rect.
	rect.fillColor = "green";
	text.fillColor = "pink";
	text.font = "50px cubic"; // Test loaded font.

	const spritesheet = new USpritesheet(umbra.assets["fire.png"], new Vector2(8, 8));
	console.log(`New spritesheet size: (${spritesheet.size.x}, ${spritesheet.size.y}).`);
	const sprite = new USprite(spritesheet, new Bounds(new Vector2(100, 150), new Vector2(150, 200)));
	sprite.fps = 12;
	sprite.doLoop = true;
}

const setupCameraControls = () => {
	// Up
	const numpad8 = new UKey(104);
	numpad8.onPress = () => {

	}
}