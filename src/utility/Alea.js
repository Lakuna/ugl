import { Mash } from "./Mash.js";

/** Seedable pseudo-random number generator by Johannes Baagøe. */
export class Alea {
	/**
	 * The version of Alea.
	 * @type {number}
	 */
	static version = 0.9;

	#random;

	/**
	* Create an instance of Alea.
	* @param {*[]} [...seeds=[new Date()]] - A list of seeds for the PRNG.
	*/
	constructor(...seeds) {
		seeds ||= [new Date()];

		/**
		 * The seeds of the instance.
		 * @type {*[]}
		 */
		this.seeds = seeds;

		const mash = new Mash();
		let s0 = mash.random(" ");
		let s1 = mash.random(" ");
		let s2 = mash.random(" ");
		for (let i = 0; i < seeds.length; i++) {
			s0 -= mash.random(seeds[i]);
			if (s0 < 0) { s0 += 1; }

			s1 -= mash.random(seeds[i]);
			if (s1 < 0) { s1 += 1; }

			s2 -= mash.random(seeds[i]);
			if (s2 < 0) { s2 += 1; }
		}

		let c = 1;

		/** @ignore */ this.#random = () => {
			const t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
			s0 = s1;
			s1 = s2;
			return s2 = t - (c = t | 0);
		}
	}

	/**
	 * Returns an unsigned random integer in the range [0, 2^32].
	 * @return {number} A pseudo-random number.
	 */
	integer() {
		return this.#random() * 0x100000000; // 2^32
	}

	/**
	 * Returns a 53-bit fraction in the range [0, 1]. This is slower than getting an integer.
	 * @return {number} A pseudo-random number.
	 */
	fraction() {
		return this.#random() + (this.#random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
	}
}