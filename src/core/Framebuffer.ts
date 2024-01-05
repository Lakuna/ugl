import ContextDependent from "#ContextDependent";
import type Context from "#Context";
import UnsupportedOperationError from "#UnsupportedOperationError";
import FramebufferTarget from "#FramebufferTarget";
import type { DangerousExposedContext } from "#DangerousExposedContext";
import getParameterForFramebufferTarget from "#getParameterForFramebufferTarget";
import FramebufferStatus from "#FramebufferStatus";

/**
 * A portion of contiguous memory that can be thought of as a collection of
 * attachments (buffers with purposes).
 * @see [`WebGLFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)
 */
export default class Framebuffer extends ContextDependent {
	/**
	 * The currently-bound framebufferbuffer cache.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		Map<FramebufferTarget, WebGLFramebuffer | null>
	>;

	/**
	 * Gets the currently-bound framebuffer for a binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @returns The framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected static getBound(
		context: Context,
		target: FramebufferTarget
	): WebGLFramebuffer | null {
		// Get the full bindings cache.
		Framebuffer.bindingsCache ??= new Map();

		// Get the context bindings cache.
		if (
			!Framebuffer.bindingsCache.has((context as DangerousExposedContext).gl)
		) {
			Framebuffer.bindingsCache.set(
				(context as DangerousExposedContext).gl,
				new Map()
			);
		}
		const contextBindingsCache: Map<
			FramebufferTarget,
			WebGLFramebuffer | null
		> = Framebuffer.bindingsCache.get((context as DangerousExposedContext).gl)!;

		// Get the bound framebuffer.
		if (!contextBindingsCache.has(target)) {
			contextBindingsCache.set(
				target,
				(context as DangerousExposedContext).gl.getParameter(
					getParameterForFramebufferTarget(target)
				)
			);
		}
		return contextBindingsCache.get(target)!;
	}

	/**
	 * Binds a framebuffer to a binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @param framebuffer The framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected static override bind(
		context: Context,
		target: FramebufferTarget,
		framebuffer: WebGLFramebuffer | null
	): void {
		// Do nothing if the binding is already correct.
		if (Framebuffer.getBound(context, target) === framebuffer) {
			return;
		}

		// Bind the framebuffer to the target.
		(context as DangerousExposedContext).gl.bindFramebuffer(
			target,
			framebuffer
		); // TODO: Check if this can throw an error.
		Framebuffer.bindingsCache!.get(
			(context as DangerousExposedContext).gl
		)!.set(target, framebuffer);
	}

	/**
	 * Unbinds the framebuffer that is bound to the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected static unbind(context: Context, target: FramebufferTarget): void;

	/**
	 * Unbinds the given framebuffer from the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @param framebuffer The framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected static unbind(
		context: Context,
		target: FramebufferTarget,
		framebuffer: WebGLFramebuffer
	): void;

	protected static unbind(
		context: Context,
		target: FramebufferTarget,
		framebuffer?: WebGLFramebuffer
	): void {
		// Do nothing if the framebuffer is already unbound.
		if (
			typeof framebuffer != "undefined" &&
			Framebuffer.getBound(context, target) != framebuffer
		) {
			return;
		}

		// Unbind the framebuffer.
		Framebuffer.bind(context, target, null);
	}

	/**
	 * Creates a framebuffer.
	 * @param context The rendering context.
	 * @see [`createFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createFramebuffer)
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(context: Context) {
		super(context);

		const framebuffer: WebGLFramebuffer | null = this.gl.createFramebuffer();
		if (framebuffer === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = framebuffer;
		this.targetCache = FramebufferTarget.FRAMEBUFFER;
	}

	/**
	 * The API interface of this framebuffer.
	 * @see [`WebGLFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)
	 * @internal
	 */
	protected readonly internal: WebGLFramebuffer;

	/**
	 * The binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	private targetCache: FramebufferTarget;

	/**
	 * The binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected get target(): FramebufferTarget {
		return this.targetCache;
	}

	/**
	 * The binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected set target(value: FramebufferTarget) {
		if (this.targetCache === value) {
			return;
		}

		this.unbind();
		this.targetCache = value;
	}

	/**
	 * The status of this framebuffer.
	 * @see [`checkFramebufferStatus`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/checkFramebufferStatus)
	 */
	public get status(): FramebufferStatus {
		// TODO: Prefer `bind` to `with`.
		return this.with(
			(framebuffer: this): FramebufferStatus =>
				framebuffer.gl.checkFramebufferStatus(framebuffer.target)
		);
	}

	/**
	 * Deletes this framebuffer.
	 * @see [`deleteFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteFramebuffer)
	 */
	public delete(): void {
		this.gl.deleteFramebuffer(this.internal);
	}

	/**
	 * Binds this framebuffer to its binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected bind(): void {
		Framebuffer.bind(this.context, this.target, this.internal);
	}

	/**
	 * Unbinds this framebuffer from its binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected unbind(): void {
		Framebuffer.unbind(this.context, this.target, this.internal);
	}

	/**
	 * Executes the given function with this framebuffer bound, then re-binds
	 * the previously-bound framebuffer.
	 * @param funktion The function to execute.
	 * @returns The return value of the executed function.
	 * @internal
	 */
	protected with<T>(funktion: (framebuffer: this) => T): T {
		// TODO: Use an existing binding if one exists.
		const previousBinding: WebGLFramebuffer | null = Framebuffer.getBound(
			this.context,
			this.target
		);
		this.bind();
		const out: T = funktion(this);
		Framebuffer.bind(this.context, this.target, previousBinding);
		return out;
	}
}
