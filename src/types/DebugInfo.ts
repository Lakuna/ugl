/**
 * An object representing a debug session of a WebGL rendering context.
 * @public
 */
export default interface DebugInfo {
	/** Whether or not debug information should be logged. This will make the rendering context very slow. */
	isActive: boolean;

	/** Whether or not the rendering context should be checked for errors after each method call (and whether or not those errors will be logged). This will dramatically reduce the speed of the debugger. */
	doLogErrors: boolean;
}
