import type AttributeValue from "./AttributeValue.js";
import type Buffer from "../core/buffers/Buffer.js";

/** An object that maps attribute names to values. */
export type AttributeMap = Record<string, AttributeValue | Buffer>;
