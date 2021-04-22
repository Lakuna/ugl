let umbra;
let shaderProgramInfo;

onload = () => {
	umbra = new Umbra();
	shaderProgramInfo = new DefaultShaderProgramInfo(umbra.gl);

	const scene = new GameObject();
	new Background(scene);
	new CanvasResizer(scene);

	umbra.scene = scene;
};
