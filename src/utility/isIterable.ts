import isCallable from "./isCallable.js";
import isRecord from "./isRecord.js";

/**
 * Determine whether or not a value is iterable.
 * @param i - The potential iterable.
 * @returns Whether or not the potential iterable is actually iterable.
 * @internal
 */
export default function isIterable(i: unknown): i is Iterable<unknown> {
	return isRecord(i) && Symbol.iterator in i && isCallable(i[Symbol.iterator]);
}
