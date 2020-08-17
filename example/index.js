let umbra;

window.onload = () => {
	umbra = new Umbra(setup, undefined, "Test");
	umbra.start();
}

const setup = () => {
	umbra.state = main;
}

const main = () => {
	console.log("Update.");
}