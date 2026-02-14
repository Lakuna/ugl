/**
 * Determine whether or not a value is callable (a function).
 * @param c - The potential callable.
 * @returns Whether or not the potential callable is actually callable.
 * @internal
 */
export default function isCallable(
	c: unknown
): c is (...args: unknown[]) => unknown {
	return typeof c === "function";
}
