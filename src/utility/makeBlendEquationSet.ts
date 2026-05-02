import type BlendEquation from "../constants/BlendEquation.js";
import type BlendEquationSet from "../types/BlendEquationSet.js";

/**
 * Make a blend equation set.
 * @param rgb - The RGB blend equation.
 * @param alpha - The alpha blend equation. Uses the RGB blend equation if undefined.
 * @returns The blend equation set.
 * @public
 */
export default function makeBlendEquationSet(
	rgb: BlendEquation,
	alpha?: BlendEquation
): BlendEquationSet & Uint8Array {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	return new Uint8Array([rgb, alpha ?? rgb]) as BlendEquationSet & Uint8Array;
}
