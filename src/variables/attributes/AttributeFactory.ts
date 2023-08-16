import type Program from "#Program";
import UnsupportedOperationError from "#UnsupportedOperationError";
import AttributeType from "#AttributeType";
import Attribute from "#Attribute";
import FloatAttribute from "#FloatAttribute";
import IntegerAttribute from "#IntegerAttribute";
import MatrixAttribute from "#MatrixAttribute";

/** A factory that creates attributes. */
export default class AttributeFactory {
    /**
     * Creates an attribute for the given variable type.
     * @param program The shader program that the attribute belongs to.
     * @param index The index of the attribute.
     */
    public static create(program: Program, index: number): Attribute {
        const activeInfo: WebGLActiveInfo | null = program.context.internal.getActiveAttrib(program.internal, index);
        if (!activeInfo) { throw new UnsupportedOperationError(); }

        switch (activeInfo.type as AttributeType) {
            case AttributeType.FLOAT:
            case AttributeType.FLOAT_VEC2:
            case AttributeType.FLOAT_VEC3:
            case AttributeType.FLOAT_VEC4:
                return new FloatAttribute(program, index);
            case AttributeType.INT:
            case AttributeType.INT_VEC2:
            case AttributeType.INT_VEC3:
            case AttributeType.INT_VEC4:
            case AttributeType.UNSIGNED_INT:
            case AttributeType.UNSIGNED_INT_VEC2:
            case AttributeType.UNSIGNED_INT_VEC3:
            case AttributeType.UNSIGNED_INT_VEC4:
            case AttributeType.BOOL:
            case AttributeType.BOOL_VEC2:
            case AttributeType.BOOL_VEC3:
            case AttributeType.BOOL_VEC4:
                return new IntegerAttribute(program, index);
            case AttributeType.FLOAT_MAT2:
                return new MatrixAttribute(program, index, 2);
            case AttributeType.FLOAT_MAT3:
                return new MatrixAttribute(program, index, 3);
            case AttributeType.FLOAT_MAT4:
                return new MatrixAttribute(program, index, 4);
            default:
                throw new UnsupportedOperationError();
        }
    }
}