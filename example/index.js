window.onload = () => {
	// Create instance.
	const umbra = new UMBRA.Umbra();

	// Mouse testing.
	const pointer = new UMBRA.Pointer(umbra);
	pointer.tap = () => console.log("Tap.");

	// Keyboard testing.
	const testKey = new UMBRA.Key(32); // Spacebar.
	testKey.press = () => console.log("Spacebar.");
}