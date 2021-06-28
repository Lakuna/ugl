import { FUNC_ADD } from "./constants.js";

export class BlendEquation {
	constructor({ gl, modeRGB = FUNC_ADD, modeAlpha } = {}) {
		// This class can be cleaned up once Bundlephobia supports private methods and properties.

		const update = () => {
			if (modeAlpha) {
				gl.blendEquationSeparate(modeRGB, modeAlpha);
			} else {
				gl.blendEquation(modeRGB);
			}
		};

		this.gl = gl;
		Object.defineProperties(this, {
			modeRGB: {
				get: () => modeRGB,
				set: (value) => {
					modeRGB = value;
					update();
				}
			},
			modeAlpha: {
				get: () => modeAlpha,
				set: (value) => {
					modeAlpha = value;
					update();
				}
			}
		});

		update();
	}
}