import Attribute from "#Attribute";
import type Program from "#Program";
import type BufferInfo from "#BufferInfo";

/** An integer, unsigned integer, or boolean input variable in a WebGL vertex shader. */
export default class IntegerAttribute extends Attribute {
    /**
     * Creates an integer, unsigned integer, or boolean attribute.
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
        this.context.internal.vertexAttribIPointer(this.location, value.size, value.type, value.stride, value.offset);
    }
}
