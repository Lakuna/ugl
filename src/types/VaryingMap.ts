import type VertexBuffer from "../core/buffers/VertexBuffer.js";
import type VaryingValue from "./VaryingValue.js";

/**
 * An object that maps varying names to output buffers.
 * @public
 */
export type VaryingMap = Record<string, VaryingValue | VertexBuffer>;
