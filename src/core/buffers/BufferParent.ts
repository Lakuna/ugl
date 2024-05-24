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
	private static bindingsCache:
		| Map<WebGL2RenderingContext, Map<BufferTarget, WebGLBuffer | null>>
		| undefined;

	/**
	 * Gets the buffer bindings cache.
	 * @returns The buffer bindings cache.
	 * @internal
	 */
	private static getBindingsCache(): Map<
		WebGL2RenderingContext,
		Map<BufferTarget, WebGLBuffer | null>
	> {
		return (BufferParent.bindingsCache ??= new Map() as Map<
			WebGL2RenderingContext,
			Map<BufferTarget, WebGLBuffer | null>
		>);
	}

	/**
	 * Gets the buffer bindings cache for a rendering context.
	 * @param context The rendering context.
	 * @returns The buffer bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(
		context: Context
	): Map<BufferTarget, WebGLBuffer | null> {
		// Get the full bindings cache.
		const bindingsCache: Map<
			WebGL2RenderingContext,
			Map<BufferTarget, WebGLBuffer | null>
		> = BufferParent.getBindingsCache();

		// Get the context bindings cache.
		let contextBindingsCache:
			| Map<BufferTarget, WebGLBuffer | null>
			| undefined = bindingsCache.get((context as DangerousExposedContext).gl);
		if (typeof contextBindingsCache === "undefined") {
			contextBindingsCache = new Map();
			bindingsCache.set(
				(context as DangerousExposedContext).gl,
				contextBindingsCache
			);
		}

		return contextBindingsCache;
	}

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
		// Get the context bindings cache.
		const contextBindingsCache: Map<BufferTarget, WebGLBuffer | null> =
			BufferParent.getContextBindingsCache(context);

		// Get the bound buffer.
		let boundBuffer: WebGLBuffer | null | undefined =
			contextBindingsCache.get(target);
		if (typeof boundBuffer === "undefined") {
			boundBuffer = (context as DangerousExposedContext).gl.getParameter(
				getParameterForBufferTarget(target)
			) as WebGLBuffer | null;
			contextBindingsCache.set(target, boundBuffer);
		}
		return boundBuffer;
	}

	/**
	 * Binds a buffer to a binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @param buffer The buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	protected static override bind(
		context: Context,
		target: BufferTarget,
		buffer: WebGLBuffer | null
	): void {
		// Do nothing if the binding is already correct.
		if (BufferParent.getBound(context, target) === buffer) {
			return;
		}

		// Get the context bindings cache.
		const contextBindingsCache: Map<BufferTarget, WebGLBuffer | null> =
			BufferParent.getContextBindingsCache(context);

		// Unbind the buffer from all other targets.
		if (buffer !== null) {
			for (const [otherTarget, otherBuffer] of contextBindingsCache) {
				if (target === otherTarget || buffer !== otherBuffer) {
					continue;
				}

				(context as DangerousExposedContext).gl.bindBuffer(otherTarget, null);
				contextBindingsCache.set(otherTarget, null);
			}
		}

		// Bind the buffer to the target.
		(context as DangerousExposedContext).gl.bindBuffer(target, buffer);
		contextBindingsCache.set(target, buffer);
	}

	/**
	 * Unbinds the buffer that is bound to the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @param buffer The buffer to unbind, or `undefined` for any buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	protected static unbind(
		context: Context,
		target: BufferTarget,
		buffer?: WebGLBuffer
	): void {
		// Do nothing if the buffer is already unbound.
		if (
			typeof buffer !== "undefined" &&
			BufferParent.getBound(context, target) !== buffer
		) {
			return;
		}

		// Unbind the buffer.
		BufferParent.bind(context, target, null);
	}

	/**
	 * Creates a buffer.
	 * @param context The rendering context.
	 * @param data The initial data contained in this buffer or the size of
	 * this buffer's data store in bytes.
	 * @param usage The intended usage of the buffer.
	 * @param offset The index of the element to start reading the buffer at.
	 * @param isHalf Whether the data contains half floats if it contains
	 * floats.
	 * @param target The target binding point of the buffer.
	 * @see [`createBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer)
	 * @throws {@link UnsupportedOperationError}
	 * @internal
	 */
	protected constructor(
		context: Context,
		data: TypedArray | number,
		usage: BufferUsage = BufferUsage.STATIC_DRAW,
		offset = 0,
		isHalf = false,
		target: BufferTarget = BufferTarget.ARRAY_BUFFER
	) {
		super(context);

		const buffer: WebGLBuffer | null = this.gl.createBuffer();
		if (buffer === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = buffer;
		this.dataCache = data;
		this.targetCache = target;
		this.usageCache = usage;
		this.offsetCache = offset;
		this.sizeCache = 0;
		this.isHalfCache = isHalf;
		this.setData(data, usage, offset, isHalf);
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
		if (this.targetCache === value) {
			return;
		}

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
	 * The size of the data in this buffer in bytes.
	 * @internal
	 */
	private sizeCache: number;

	/** The size of the data in this buffer in bytes. */
	public get size(): number {
		return this.sizeCache;
	}

	/**
	 * Whether this buffer contains 16-bit floating-point data if it contains
	 * floating-point data.
	 * @internal
	 */
	private isHalfCache: boolean;

	/**
	 * Whether this buffer contains 16-bit floating-point data if it contains
	 * floating-point data.
	 */
	public get isHalf(): boolean {
		return this.isHalfCache;
	}

	/**
	 * Sets the data in this buffer.
	 * @param data The data to store in this buffer or the size to set this
	 * buffer's data store to in bytes.
	 * @param usage The intended usage of the buffer.
	 * @param offset The index of the element to start reading the supplied
	 * data at.
	 * @param isHalf Whether the data contains 16-bit floating-point data if it
	 * contains floating-point data.
	 */
	public setData(
		data: TypedArray | number,
		usage?: BufferUsage,
		offset?: number,
		isHalf?: boolean
	): void;

	/**
	 * Updates a subset of the data in this buffer.
	 * @param data The data to store in this buffer.
	 * @param _ An ignored value.
	 * @param offset The index of the element to start reading the supplied
	 * data at.
	 * @param __ An ignored value.
	 * @param replaceOffset The offset in bytes to start replacing data at.
	 */
	public setData(
		data: TypedArray,
		_: never,
		offset: number,
		__: never,
		replaceOffset: number
	): void;

	public setData(
		data: TypedArray | number,
		usage: BufferUsage = BufferUsage.STATIC_DRAW,
		offset = 0,
		isHalf = false,
		replaceOffset?: number
	): void {
		if (typeof replaceOffset === "number") {
			this.gl.bufferSubData(
				this.target,
				replaceOffset,
				data as TypedArray,
				offset
			);
			this.dataCache = null;
		} else {
			this.gl.bufferData(this.target, data as TypedArray, usage, offset);
			this.dataCache = data;
			this.sizeCache = typeof data === "number" ? data : data.byteLength;
			this.usageCache = usage;
			this.isHalfCache = isHalf;
		}
		this.context.throwIfError();
		this.offsetCache = offset;
	}

	/**
	 * Deletes this buffer.
	 * @see [`deleteBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteBuffer)
	 */
	public delete(): void {
		this.gl.deleteBuffer(this.internal);
	}

	/**
	 * Binds this buffer to its binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
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
