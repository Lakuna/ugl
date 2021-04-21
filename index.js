let umbra;
let shaderProgramInfo;

onload = () => {
	umbra = new Umbra();
	shaderProgramInfo = new DefaultShaderProgramInfo(umbra.gl);

	const scene = new GameObject();
	new Background(scene, 0x50 / 0xFF, 0xC8 / 0xFF, 0x78 / 0xFF);
	new CanvasResizer(scene);
	new Component(scene)[Component.events.UPDATE] = () => console.log(1 / umbra.deltaTime);

	umbra.scene = scene;
};
