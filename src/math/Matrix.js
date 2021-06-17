export class Matrix extends Array {
	// TODO
}
Matrix.fromRule = (width, height, rule) => {
	let data = [];
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			data[y * width + x] = rule(x, y);
		}
	}
	return new Matrix(...data);
};