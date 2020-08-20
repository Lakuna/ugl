window.onload = () => {
	new Umbra(() => console.log("Setup"), () => console.log("Load"), "Test");
	Umbra.instance.start();
}