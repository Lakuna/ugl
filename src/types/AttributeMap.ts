import type AttributeValue from "./AttributeValue.js";
import type VertexBuffer from "../core/buffers/VertexBuffer.js";

/**
 * An object that maps attribute names to values.
 * @public
 */
export type AttributeMap = Record<string, AttributeValue | VertexBuffer>;
