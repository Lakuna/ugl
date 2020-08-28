let umbra;
let camera;
let pointer;
let originalViewport;

onload = () => {
	console.log("Starting Umbra v1.0 Test.");

	// Create framework.
	umbra = new Umbra(setup, load, "1.0 Test", ["blip.wav", "cubic.ttf", "example.json", "fire.png"]);

	// Change camera.
	camera = new UCamera(new Bounds(new Vector2(0, 0), new Vector2(innerWidth / 2, innerHeight / 2)));
	umbra.camera = camera;
	originalViewport = camera.bounds;

	// Save pointer.
	pointer = umbra.pointer;

	// Start framework.
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

	setupPointerFollower();

	// umbra.scene = new UObject(); // Uncommenting this line will empty the screen.

	makeAudioButton();
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
	// Move
	const move = (x, y) => camera.bounds.translate(new Vector2(x, y));
	new UKey(38).onPress = () => move(0, camera.bounds.height * -0.1); // Up
	new UKey(104).onPress = () => move(0, camera.bounds.height * -0.1); // 8 (Up)
	new UKey(39).onPress = () => move(camera.bounds.width * 0.1, 0); // Right
	new UKey(102).onPress = () => move(camera.bounds.width * 0.1, 0); // 6 (Right)
	new UKey(37).onPress = () => move(camera.bounds.width * -0.1, 0); // Left
	new UKey(100).onPress = () => move(camera.bounds.width * -0.1, 0); // 4 (Left)
	new UKey(40).onPress = () => move(0, camera.bounds.height * 0.1); // Down
	new UKey(98).onPress = () => move(0, camera.bounds.height * 0.1); // 2 (Down)

	// Reset.
	const reset = () => {
		camera.bounds.translate(new Vector2(-camera.bounds.min.x, -camera.bounds.min.y));
		camera.bounds.width = innerWidth / 2;
		camera.bounds.height = innerHeight / 2;
	}
	new UKey(12).onPress = () => reset(); // Clear
	new UKey(101).onPress = () => reset(); // 5 (Clear)

	// Scale.
	const scale = (x, y) => {
		camera.bounds.width += x;
		camera.bounds.min.x -= x / 2;
		camera.bounds.height += y;
		camera.bounds.min.y -= y / 2;
		console.log(`New scale: (${camera.scale.x}, ${camera.scale.y})`);
	}
	new UKey(36).onPress = () => scale(camera.bounds.width * -0.1, 0); // Home (-x)
	new UKey(103).onPress = () => scale(camera.bounds.width * -0.1, 0); // 7 (-x)
	new UKey(33).onPress = () => scale(camera.bounds.width * 0.1, 0); // PageUp (+x)
	new UKey(105).onPress = () => scale(camera.bounds.width * 0.1, 0); // 9 (+x)
	new UKey(35).onPress = () => scale(0, camera.bounds.height * -0.1); // End (-y)
	new UKey(97).onPress = () => scale(0, camera.bounds.height * -0.1); // 1 (-y)
	new UKey(34).onPress = () => scale(0, camera.bounds.height * 0.1); // PageDown (+y)
	new UKey(99).onPress = () => scale(0, camera.bounds.height * 0.1); // 3 (+y)
}

const setupPointerFollower = () => {
	const pointerFollower = new UText("");
	umbra.updates.push(() => {
		pointerFollower.bounds.min = camera.sPToG(pointer.pos);
		pointerFollower.text = `(${pointer.pos.x}, ${pointer.pos.y})`;
	});
}

const makeAudioButton = () => {
	const beep = umbra.assets["blip.wav"];
	const button = new URect(new Bounds(new Vector2(150, 150), new Vector2(200, 200)));
	const buttonText = new UText("Beep", button.bounds, button);
	buttonText.fillColor = "black";
	button.onClick = () => {
		beep.isPlaying = true;
		beep.sound.loop = true;
	}
	button.onRelease = () => beep.isPlaying = false;
}