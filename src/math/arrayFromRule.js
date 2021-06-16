export const arrayFromRule = (length, rule) => {
	let data = [];
	for (let i = 0; i < length; i++) {
		data[i] = rule(i);
	}
	return data;
};