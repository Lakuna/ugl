import type AttributeValue from "./AttributeValue.js";
import type Vbo from "../core/buffers/Vbo.js";

/**
 * An object that maps attribute names to values.
 * @public
 */
export type AttributeMap = Record<string, AttributeValue | Vbo>;
