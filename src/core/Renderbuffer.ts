import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import { RENDERBUFFER, RENDERBUFFER_BINDING } from "#constants";
import type { DangerousExposedContext } from "#DangerousExposedContext";

/**
 * An object that contains an image and is optimized as a rendering target.
 * @see [`WebGLRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderbuffer)
 */
export default class Renderbuffer extends ContextDependent {
	/**
	 * The currently-bound renderbuffer cache.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		WebGLRenderbuffer | null
	>;

	/**
	 * Gets the currently-bound renderbuffer.
	 * @param context The rendering context.
	 * @returns The renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	protected static getBound(context: Context): WebGLRenderbuffer | null {
		if (typeof this.bindingsCache == "undefined") {
			this.bindingsCache = new Map();
		}
		if (!this.bindingsCache.has((context as DangerousExposedContext).gl)) {
			this.bindingsCache.set(
				(context as DangerousExposedContext).gl,
				(context as DangerousExposedContext).gl.getParameter(
					RENDERBUFFER_BINDING
				)
			);
		}
		return this.bindingsCache.get((context as DangerousExposedContext).gl)!;
	}

	/**
	 * Binds a renderbuffer.
	 * @param context The rendering context.
	 * @param renderbuffer The renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	protected static override bind(
		context: Context,
		renderbuffer: WebGLRenderbuffer | null
	): void {
		if (Renderbuffer.getBound(context) == renderbuffer) {
			return;
		}
		(context as DangerousExposedContext).gl.bindRenderbuffer(
			RENDERBUFFER,
			renderbuffer
		);
		context.throwIfError();
		Renderbuffer.bindingsCache!.set(
			(context as DangerousExposedContext).gl,
			renderbuffer
		);
	}

	/**
	 * Unbinds the renderbuffer that is bound.
	 * @param context The rendering context.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	protected static unbind(context: Context): void;

	/**
	 * Unbinds the given renderbuffer.
	 * @param context The rendering context.
	 * @param renderbuffer The renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	protected static unbind(
		context: Context,
		renderbuffer: WebGLRenderbuffer
	): void;

	protected static unbind(
		context: Context,
		renderbuffer?: WebGLRenderbuffer
	): void {
		if (
			typeof renderbuffer != "undefined" &&
			Renderbuffer.getBound(context) != renderbuffer
		) {
			return;
		}
		Renderbuffer.bind(context, null);
	}

	/**
	 * Creates a renderbuffer.
	 * @param context The rendering context.
	 * @see [`createRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createRenderbuffer)
	 */
	public constructor(context: Context) {
		super(context);

		const renderbuffer: WebGLRenderbuffer | null = this.gl.createRenderbuffer();
		if (renderbuffer == null) {
			throw new UnsupportedOperationError();
		}
		this.internal = renderbuffer;
	}

	/**
	 * The API interface of this renderbuffer.
	 * @see [`WebGLRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderbuffer)
	 * @internal
	 */
	protected readonly internal: WebGLRenderbuffer;

	/**
	 * Binds this renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	protected bind(): void {
		Renderbuffer.bind(this.context, this.internal);
	}

	/**
	 * Unbinds this renderbuffer.
	 * @see [`bindRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindRenderbuffer)
	 * @internal
	 */
	protected unbind(): void {
		Renderbuffer.unbind(this.context, this.internal);
	}

	/**
	 * Executes the given function with this renderbuffer bound, then re-binds
	 * the previously-bound renderbuffer.
	 * @param funktion The function to execute.
	 * @returns The return value of the executed function.
	 * @internal
	 */
	protected with<T>(funktion: (renderbuffer: this) => T): T {
		const previousBinding: WebGLRenderbuffer | null = Renderbuffer.getBound(
			this.context
		);
		this.bind();
		const out: T = funktion(this);
		Renderbuffer.bind(this.context, previousBinding);
		return out;
	}
}