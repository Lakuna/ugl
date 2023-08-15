import Attribute from "#Attribute";
import type Program from "#Program";
import type BufferInfo from "#BufferInfo";

/** A float input variable in a WebGL vertex shader. */
export default class FloatAttribute extends Attribute {
    /**
     * Creates a float attribute.
     * @param program The shader program that this attribute belongs to.
     * @param index The index of this attribute.
     */
    public constructor(program: Program, index: number) {
        super(program, index);
    }

    /**
     * The setter method for this attribute.
     * @param value The value to pass to the attribute.
     */
    protected setterInternal(value: BufferInfo): void {
        this.context.internal.vertexAttribPointer(this.location, value.size, value.type, value.normalized, value.stride, value.offset);
    }
}
