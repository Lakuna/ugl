/** An error resulting from a shader program failing to link. */
export default class ProgramLinkError extends Error {
    /**
     * Creates an error resulting from a shader program failing to link.
     * @param message The message of the error.
     */
    public constructor(message = "The shader program failed to link.") {
        super(message);
        this.name = "ProgramLinkError";
    }
}
