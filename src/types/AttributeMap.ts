import type AttributeValue from "./AttributeValue.js";
import type Buffer from "../core/buffers/Buffer.js";

/**
 * An object that maps attribute names to values.
 * @public
 */
export type AttributeMap = Record<string, AttributeValue | Buffer>;
