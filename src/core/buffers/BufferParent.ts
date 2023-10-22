import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import BufferTarget from "#BufferTarget";
import type { DangerousExposedContext } from "#DangerousExposedContext";
import getParameterForBufferTarget from "#getParameterForBufferTarget";
import BufferUsage from "#BufferUsage";
import type { TypedArray } from "#TypedArray";

/**
 * An array of binary data.
 * @see [`WebGLBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer)
 */
export default abstract class BufferParent extends ContextDependent {
	/**
	 * The currently-bound buffer cache.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		Map<BufferTarget, WebGLBuffer | null>
	>;

	/**
	 * Gets the currently-bound buffer for a binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @returns The buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	protected static getBound(
		context: Context,
		target: BufferTarget
	): WebGLBuffer | null {
		if (typeof this.bindingsCache == "undefined") {
			this.bindingsCache = new Map();
		}
		if (!this.bindingsCache.has((context as DangerousExposedContext).gl)) {
			this.bindingsCache.set(
				(context as DangerousExposedContext).gl,
				new Map()
			);
		}
		const contextMap: Map<BufferTarget, WebGLBuffer | null> =
			this.bindingsCache.get((context as DangerousExposedContext).gl)!;
		if (!contextMap.has(target)) {
			contextMap.set(
				target,
				(context as DangerousExposedContext).gl.getParameter(
					getParameterForBufferTarget(target)
				)
			);
		}
		return contextMap.get(target)!;
	}

	/**
	 * Binds a buffer to a binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @param buffer The buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @throws {@link WebglError}
	 * @internal
	 */
	protected static override bind(
		context: Context,
		target: BufferTarget,
		buffer: WebGLBuffer | null
	): void {
		if (BufferParent.getBound(context, target) == buffer) {
			return;
		}
		(context as DangerousExposedContext).gl.bindBuffer(target, buffer);
		context.throwIfError();
		BufferParent.bindingsCache!.get(
			(context as DangerousExposedContext).gl
		)!.set(target, buffer);
	}

	/**
	 * Unbinds the buffer that is bound to the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	protected static unbind(context: Context, target: BufferTarget): void;

	/**
	 * Unbinds the given buffer from the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @param buffer The buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	protected static unbind(
		context: Context,
		target: BufferTarget,
		buffer: WebGLBuffer
	): void;

	protected static unbind(
		context: Context,
		target: BufferTarget,
		buffer?: WebGLBuffer
	): void {
		if (
			typeof buffer != "undefined" &&
			BufferParent.getBound(context, target) != buffer
		) {
			return;
		}
		BufferParent.bind(context, target, null);
	}

	/**
	 * Creates a buffer.
	 * @param context The rendering context.
	 * @param data The initial data contained in this buffer or the size of
	 * this buffer's data store in bytes.
	 * @param usage The intended usage of the buffer.
	 * @param offset The index of the element to start reading the buffer at.
	 * @param target The target binding point of the buffer.
	 * @see [`createBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer)
	 * @throws {@link WebglError}
	 * @internal
	 */
	protected constructor(
		context: Context,
		data: TypedArray | number,
		usage: BufferUsage = BufferUsage.STATIC_DRAW,
		offset = 0,
		target: BufferTarget = BufferTarget.ARRAY_BUFFER
	) {
		super(context);

		const buffer: WebGLBuffer | null = this.gl.createBuffer();
		if (buffer == null) {
			throw new UnsupportedOperationError();
		}
		this.internal = buffer;
		this.dataCache = data;
		this.targetCache = target;
		this.usageCache = usage;
		this.offsetCache = offset;
		this.setData(data, usage, offset);
	}

	/**
	 * The API interface of this buffer.
	 * @see [`WebGLBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer)
	 * @internal
	 */
	protected readonly internal: WebGLBuffer;

	/**
	 * The binding point of this buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	private targetCache: BufferTarget;

	/**
	 * The binding point of this buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	protected get target(): BufferTarget {
		return this.targetCache;
	}

	/**
	 * The binding point of this buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	protected set target(value: BufferTarget) {
		this.unbind();
		this.targetCache = value;
	}

	/**
	 * The intended usage of this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 * @internal
	 */
	private usageCache: BufferUsage;

	/**
	 * The intended usage of this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 */
	public get usage(): BufferUsage {
		return this.usageCache;
	}

	/**
	 * The data contained in this buffer or the size of this buffer's data
	 * store in bytes.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 * @internal
	 */
	private dataCache: TypedArray | number | null;

	/**
	 * The data contained in this buffer or the size of this buffer's data
	 * store in bytes.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 */
	public get data(): Readonly<TypedArray> | number | null {
		return this.dataCache;
	}

	/**
	 * The element index offset at which to start reading this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 * @internal
	 */
	private offsetCache: number;

	/**
	 * The element index offset at which to start reading this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 */
	public get offset(): number {
		return this.offsetCache;
	}

	/**
	 * Sets the data in this buffer.
	 * @param data The data to store in this buffer or the size to set this
	 * buffer's data store to in bytes.
	 * @param usage The intended usage of the buffer.
	 * @param offset The index of the element to start reading the buffer at.
	 * @throws {@link WebglError}
	 */
	public setData(
		data: TypedArray | number,
		usage?: BufferUsage,
		offset?: number
	): void;

	/**
	 * Updates a subset of the data in this buffer.
	 * @param data The data to store in this buffer.
	 * @param _ An ignored value.
	 * @param offset The index of the element to start reading the buffer at.
	 * @param replaceOffset The offset in bytes to start replacing data at.
	 * @throws {@link WebglError}
	 */
	public setData(
		data: TypedArray,
		_: never,
		offset: number,
		replaceOffset: number
	): void;

	public setData(
		data: TypedArray | number,
		usage: BufferUsage = BufferUsage.STATIC_DRAW,
		offset = 0,
		replaceOffset?: number
	): void {
		if (typeof replaceOffset == "number") {
			this.gl.bufferSubData(
				this.target,
				replaceOffset,
				data as TypedArray,
				offset
			);
			this.context.throwIfError();
			this.dataCache = null;
		} else {
			this.gl.bufferData(this.target, data as TypedArray, usage, offset);
			this.context.throwIfError();
			this.dataCache = data;
			this.usageCache = usage;
		}
		this.offsetCache = offset;
	}

	/**
	 * Binds this buffer to its binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @throws {@link WebglError}
	 * @internal
	 */
	protected bind(): void {
		BufferParent.bind(this.context, this.target, this.internal);
	}

	/**
	 * Unbinds this buffer from its binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	protected unbind(): void {
		BufferParent.unbind(this.context, this.target, this.internal);
	}

	/**
	 * Executes the given function with this buffer bound, then re-binds the
	 * previously-bound buffer.
	 * @param funktion The function to execute.
	 * @returns The return value of the executed function.
	 * @throws {@link WebglError}
	 * @internal
	 */
	protected with<T>(funktion: (buffer: this) => T): T {
		const previousBinding: WebGLBuffer | null = BufferParent.getBound(
			this.context,
			this.target
		);
		this.bind();
		const out: T = funktion(this);
		BufferParent.bind(this.context, this.target, previousBinding);
		return out;
	}
}
