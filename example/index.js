let umbra;
let circles = [];

window.onload = () => {
	umbra = new Umbra(setup, "Test");
	umbra.start();
}

const setup = () => {
	// Test tap fuction.
	umbra.pointer.tap = () => {
		const circle = new CircleSprite(umbra);
		circle.pos = umbra.pointer.pos;
		circle.size.x = 10;
		console.log(`Scene children: ${umbra.scene.children.length}`);
	};

	// Test key function.
	new Key(32).press = () => console.log("Spacebar pressed.");

	umbra.state = main;
}

const main = () => { }