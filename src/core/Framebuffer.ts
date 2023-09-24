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
		Context,
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
		if (typeof this.bindingsCache == "undefined") {
			this.bindingsCache = new Map();
		}
		if (!this.bindingsCache.has(context)) {
			this.bindingsCache.set(context, new Map());
		}
		const contextMap: Map<FramebufferTarget, WebGLFramebuffer | null> =
			this.bindingsCache.get(context)!;
		if (!contextMap.has(target)) {
			contextMap.set(
				target,
				(context as DangerousExposedContext).gl.getParameter(
					getParameterForFramebufferTarget(target)
				)
			);
		}
		return contextMap.get(target)!;
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
		if (Framebuffer.getBound(context, target) == framebuffer) {
			return;
		}
		(context as DangerousExposedContext).gl.bindFramebuffer(
			target,
			framebuffer
		);
		context.throwIfError();
		Framebuffer.bindingsCache!.get(context)!.set(target, framebuffer);
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
		if (
			typeof framebuffer != "undefined" &&
			Framebuffer.getBound(context, target) != framebuffer
		) {
			return;
		}
		Framebuffer.bind(context, target, null);
	}

	/**
	 * Creates a framebuffer.
	 * @param context The rendering context.
	 * @param target The target binding point of the framebuffer.
	 * @see [`createFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createFramebuffer)
	 */
	public constructor(
		context: Context,
		target: FramebufferTarget = FramebufferTarget.FRAMEBUFFER
	) {
		super(context);

		const framebuffer: WebGLFramebuffer | null = this.gl.createFramebuffer();
		if (framebuffer == null) {
			throw new UnsupportedOperationError();
		}
		this.internal = framebuffer;
		this.targetCache = target;
	}

	/**
	 * The API interface of this framebuffer.
	 * @internal
	 * @see [`WebGLFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)
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
	 */
	public get target(): FramebufferTarget {
		return this.targetCache;
	}

	/**
	 * The binding point of this framebuffer.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 */
	public set target(value: FramebufferTarget) {
		this.unbind();
		this.targetCache = value;
	}

	/**
	 * The status of this framebuffer.
	 * @see [`checkFramebufferStatus`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/checkFramebufferStatus)
	 */
	public get status(): FramebufferStatus {
		return this.with(
			(framebuffer: this): FramebufferStatus =>
				framebuffer.gl.checkFramebufferStatus(framebuffer.target)
		);
	}

	/**
	 * Binds this framebuffer to its binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 */
	public bind(): void {
		Framebuffer.bind(this.context, this.target, this.internal);
	}

	/**
	 * Unbinds this framebuffer from its binding point.
	 * @see [`bindFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindFramebuffer)
	 */
	public unbind(): void {
		Framebuffer.unbind(this.context, this.target, this.internal);
	}

	/**
	 * Executes the given function with this framebuffer bound, then re-binds
	 * the previously-bound framebuffer.
	 * @param funktion The function to execute.
	 * @returns The return value of the executed function.
	 */
	public with<T>(funktion: (framebuffer: this) => T): T {
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
