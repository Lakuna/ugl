import BufferTarget from "#BufferTarget";
import {
	ARRAY_BUFFER_BINDING,
	COPY_READ_BUFFER_BINDING,
	COPY_WRITE_BUFFER_BINDING,
	ELEMENT_ARRAY_BUFFER_BINDING,
	PIXEL_PACK_BUFFER_BINDING,
	PIXEL_UNPACK_BUFFER_BINDING,
	TRANSFORM_FEEDBACK_BUFFER_BINDING,
	UNIFORM_BUFFER_BINDING
} from "#constants";

/**
 * Gets the constant value representing the context property of the given
 * buffer binding point.
 * @param target The buffer binding point.
 * @returns The constant value.
 * @internal
 */
export default function getParameterForBufferTarget(
	target: BufferTarget
): number {
	switch (target) {
		case BufferTarget.ARRAY_BUFFER:
			return ARRAY_BUFFER_BINDING;
		case BufferTarget.COPY_READ_BUFFER:
			return COPY_READ_BUFFER_BINDING;
		case BufferTarget.COPY_WRITE_BUFFER:
			return COPY_WRITE_BUFFER_BINDING;
		case BufferTarget.ELEMENT_ARRAY_BUFFER:
			return ELEMENT_ARRAY_BUFFER_BINDING;
		case BufferTarget.PIXEL_PACK_BUFFER:
			return PIXEL_PACK_BUFFER_BINDING;
		case BufferTarget.PIXEL_UNPACK_BUFFER:
			return PIXEL_UNPACK_BUFFER_BINDING;
		case BufferTarget.TRANSFORM_FEEDBACK_BUFFER:
			return TRANSFORM_FEEDBACK_BUFFER_BINDING;
		case BufferTarget.UNIFORM_BUFFER:
			return UNIFORM_BUFFER_BINDING;
	}
}
