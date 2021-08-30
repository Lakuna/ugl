/** Seedable PRNG function by Johannes Baagøe. */
export class Mash {
	/**
	 * The version of the algorithm.
	 * @type {number}
	 */
	static version = 0.9;

	#n;

	/**
	 * Create a Mash instance.
	 */
	constructor() {
		/** @ignore */ this.#n = 0xEFC8249D;
	}

	/**
	 * Run the algorithm.
	 * @param {*} [data] - The data for the algorithm to work with.
	 * @return {number} The result of the algorithm.
	 */
	random(data) {
		data = data.toString();

		for (let i = 0; i < data.length; i++) {
			this.#n += data.charCodeAt(i);
			let h = 0.02519603282416938 * this.#n;
			this.#n = h >>> 0;
			h -= this.#n;
			h *= this.#n;
			this.#n = h >>> 0;
			h -= this.#n;
			this.#n += h * 0x100000000; // 2^32
		}

		return (this.#n >>> 0) * 2.3283064365386963e-10; // 2^-32
	}
}