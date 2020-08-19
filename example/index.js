let umbra;
let circles = [];

window.onload = () => {
	umbra = new Umbra(setup, "Test");
	umbra.start();
}

const setup = () => {
	// Print screen values.
	console.log(`Screen global range: (${umbra.camera.pos.x} - ${umbra.camera.pos.x + umbra.camera.range.x}, ${umbra.camera.pos.y} - ${umbra.camera.pos.y + umbra.camera.range.y})`);

	// Test tap fuction.
	umbra.pointer.tap = () => {
		const circle = new CircleSprite(umbra);
		circle.setScreenPosition(umbra.pointer.pos);
		circle.size.x = 10;
		console.log(`New circle (${umbra.scene.children.length}):\n\tScreen position (${circle.sPos.x}, ${circle.sPos.y})\n\tGlobal position: (${circle.pos.x}, ${circle.pos.y})`);
	};

	// Test key function.
	new Key(32).press = () => console.log("Spacebar pressed.");

	// Set main state of game loop.
	umbra.state = main;
}

const main = () => { }