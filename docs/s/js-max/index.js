// Public Domain Pixel Art: https://opengameart.org/content/free-pixel-effects-pack
// Taurus Mono Font: https://www.dafont.com/taurus-mono.font
const assetPaths = ['/s/audio/coin.mp3', '/s/img/nebula.png', '/s/font/taurus.otf'];
let umbra, pointerPositionText, loadedAssets = 0;

onload = () => {
	umbra = new Umbra(setup, undefined, 'Umbra', '#222', assetPaths);
	umbra.start();
};

const setup = () => {
	// Load main menu.
	umbra.state = main;

	// Tap audio.
	umbra.pointer.onPress = () => umbra.assets['/s/audio/coin.mp3'].isPlaying = true;

	// Border
	new ULine(new Bounds(new Vector2(), new Vector2(innerWidth, 0))).lineColor = '#fffff0'; // Top
	new ULine(new Bounds(new Vector2(), new Vector2(0, innerHeight))).lineColor = '#fffff0'; // Left
	new ULine(new Bounds(new Vector2(0, innerHeight), new Vector2(innerWidth, innerHeight))).lineColor = '#fffff0'; // Bottom
	new ULine(new Bounds(new Vector2(innerWidth, 0), new Vector2(innerWidth, innerHeight))).lineColor = '#fffff0'; // Right

	// Title.
	const title = new UText('UMBRA', new Bounds(new Vector2(innerWidth / 2)));
	title.fillColor = '#50c878';
	title.font = '80px taurus';
	title.bounds.min.x -= umbra.context.measureText(title.text).width * 4;

	// GIF.
	const fireDim = Math.min(innerWidth / 3 * 2, innerHeight / 2);
	const fire = new USprite(new USpritesheet(umbra.assets['/s/img/nebula.png'], new Vector2(100, 100)), new Bounds(
		new Vector2(innerWidth / 2 - fireDim / 2, innerHeight / 12),
		new Vector2(innerWidth / 2 - fireDim / 2 + fireDim, innerHeight / 12 + fireDim)
	));
	fire.fps = 5;
	fire.doLoop = true;

	// Documentation button.
	const docb = new URect(new Bounds(new Vector2(innerWidth / 6, innerHeight / 12 * 7), new Vector2(innerWidth / 6 * 5, innerHeight / 3 * 2)));
	docb.lineColor = '#fffff0';
	docb.fillColor = '#333';
	docb.onClick = () => location.href = 'https://umbra-framework.readthedocs.io';
	new UText('Documentation', new Bounds(new Vector2(
			docb.bounds.min.x + docb.bounds.width / 2 - umbra.context.measureText('Documentation').width,
			docb.bounds.min.y + docb.bounds.height / 2 - umbra.context.measureText('M').width
	)), docb);

	// Download button.
	const dwnb = new URect(new Bounds(new Vector2(innerWidth / 6, innerHeight / 6 * 5), new Vector2(innerWidth / 6 * 5, innerHeight / 12 * 11)));
	dwnb.lineColor = '#fffff0';
	dwnb.fillColor = '#333';
	dwnb.onClick = () => location.href = 'https://github.com/T3Lakuna/Umbra-Builder/releases/latest';
	new UText('Download', new Bounds(new Vector2(
			dwnb.bounds.min.x + dwnb.bounds.width / 2 - umbra.context.measureText('Download').width,
			dwnb.bounds.min.y + dwnb.bounds.height / 2 - umbra.context.measureText('M').width
	)), dwnb);

	// Pointer follower.
	pointerPositionText = new UText('');
	pointerPositionText.fillColor = '#fffff0';
};


const main = () => {
	pointerPositionText.bounds = new Bounds(umbra.pointer.pos);
	pointerPositionText.text = `(${umbra.pointer.pos.x}, ${umbra.pointer.pos.y})`;
};