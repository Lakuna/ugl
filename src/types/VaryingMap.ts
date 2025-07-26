import type VaryingValue from "./VaryingValue.js";
import type VertexBuffer from "../core/buffers/VertexBuffer.js";

/**
 * An object that maps varying names to output buffers.
 * @public
 */
export type VaryingMap = Record<string, VertexBuffer | VaryingValue>;
