/**
 * Determine whether or not a value is a record of strings and/or symbols to values (an object).
 * @param r - The potential record.
 * @returns Whether or not the potential record is actually a record.
 * @internal
 */
export default function isRecord(
	r: unknown
): r is Record<string | symbol, unknown> {
	return typeof r === "object" && r !== null;
}
