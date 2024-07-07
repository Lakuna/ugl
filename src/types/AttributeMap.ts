import type AttributeValue from "#AttributeValue";
import type Buffer from "#Buffer";

/** An object that maps attribute names to values. */
export type AttributeMap = Record<string, AttributeValue | Buffer>;
