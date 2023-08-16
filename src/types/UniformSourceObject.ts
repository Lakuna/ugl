import type { UniformValue } from "#UniformValue";

/** An object with property names and values corresponding to uniform names and values. */
export default interface UniformSourceObject {
	/** The property which holds the value for the uniform with the same name. */
	[key: string]: UniformValue;
}
