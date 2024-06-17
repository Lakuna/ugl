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
	private static bindingsCache:
		| Map<
				WebGL2RenderingContext,
				Map<FramebufferTarget, WebGLFramebuffer | null>
		  >
		| undefined;

	/**
	 * Gets the framebuffer bindings cache.
	 * @returns The framebuffer bindings cache.
	 * @internal
	 */
	private static getBindingsCache(): Map<
		WebGL2RenderingContext,
		Map<FramebufferTarget, WebGLFramebuffer | null>
	> {
		return (Framebuffer.bindingsCache ??= new Map() as Map<
			WebGL2RenderingContext,
			Map<FramebufferTarget, WebGLFramebuffer | null>
		>);
	}

	/**
	 * Gets the framebuffer bindings cache for a rendering context.
	 * @param context The rendering context.
	 * @returns The framebuffer bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(
		context: Context
	): Map<FramebufferTarget, WebGLFramebuffer | null> {
		// Get the full bindings cache.
		const bindingsCache: Map<
			WebGL2RenderingContext,
			Map<FramebufferTarget, WebGLFramebuffer | null>
		> = Framebuffer.getBindingsCache();

		// Get the context bindings cache.
		let contextBindingsCache:
			| Map<FramebufferTarget, WebGLFramebuffer | null>
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
	 * Gets the currently-bound framebuffer for a binding point.
	 * @param context The rendering context.
	 * @param target The binding point. Note that `FRAMEBUFFER` will return the
	 * same value as `DRAW_FRAMEBUFFER`.
	 * @returns The framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected static getBound(
		context: Context,
		target: FramebufferTarget
	): WebGLFramebuffer | null {
		// Get the context bindings cache.
		const contextBindingsCache: Map<
			FramebufferTarget,
			WebGLFramebuffer | null
		> = Framebuffer.getContextBindingsCache(context);

		// Get the bound framebuffer.
		let boundFramebuffer: WebGLFramebuffer | null | undefined =
			contextBindingsCache.get(target);
		if (typeof boundFramebuffer === "undefined") {
			boundFramebuffer = (context as DangerousExposedContext).gl.getParameter(
				getParameterForFramebufferTarget(target)
			) as WebGLFramebuffer | null;
			contextBindingsCache.set(target, boundFramebuffer);
		}
		return boundFramebuffer;
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
		);

		// Update the bindings cache.
		const contextBindingsCache = Framebuffer.getContextBindingsCache(context);
		contextBindingsCache.set(target, framebuffer);
		switch (target) {
			case FramebufferTarget.FRAMEBUFFER:
				// For `FRAMEBUFFER`, update all binding points.
				contextBindingsCache.set(
					FramebufferTarget.READ_FRAMEBUFFER,
					framebuffer
				);
				contextBindingsCache.set(
					FramebufferTarget.DRAW_FRAMEBUFFER,
					framebuffer
				);
				break;
			case FramebufferTarget.DRAW_FRAMEBUFFER:
				// For `DRAW_FRAMEBUFFER`, update `FRAMEBUFFER` too (`FRAMEBUFFER_BINDING` always returns `DRAW_FRAMEBUFFER_BINDING`).
				contextBindingsCache.set(FramebufferTarget.FRAMEBUFFER, framebuffer);
		}
	}

	/**
	 * Unbinds the given framebuffer from the given binding point.
	 * @param context The rendering context.
	 * @param target The binding point.
	 * @param framebuffer The framebuffer, or `undefined` for any framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected static unbind(
		context: Context,
		target: FramebufferTarget,
		framebuffer?: WebGLFramebuffer
	): void {
		// Do nothing if the framebuffer is already unbound.
		if (
			typeof framebuffer !== "undefined" &&
			Framebuffer.getBound(context, target) !== framebuffer
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
		this.bind();
		return this.gl.checkFramebufferStatus(this.target);
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
	 * @param target The new binding point to bind to, or `undefined` for the
	 * previous binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 * @internal
	 */
	protected bind(target?: FramebufferTarget): void {
		if (typeof target !== "undefined") {
			this.target = target;
		}

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
