import { Component, ComponentEvent } from "./Component";
import { GameObject } from "./GameObject";
import { makeFullscreenCanvas } from "../utility/makeFullscreenCanvas";

/** A controller for a program which uses Umbra. */
export class Umbra {
	#scene: GameObject;
	readonly #fixedInterval: NodeJS.Timer;
	#stopLoop: boolean;

	/**
	 * Creates an instance of Umbra.
	 * @param canvas - The canvas for the instance to render to.
	 * @param ups - Updates per second of the fixed update loop.
	 */
	constructor(canvas: HTMLCanvasElement = makeFullscreenCanvas(), ups = 30) {
		this.gl = canvas.getContext("webgl2");
		if (!this.gl) {
			throw new Error("WebGL2 is not supported by your browser.");
		}

		this.time = 0;
		this.deltaTime = 0;
		this.paused = false;
		let then = 0;

		const update = (now: number): void => {
			if (!this.#stopLoop) {
				requestAnimationFrame(update);
			}

			this.time = now;
			this.deltaTime = now - then;
			then = now;

			if (!this.paused) {
				this.trigger(ComponentEvent.Update);
			}
		}
		requestAnimationFrame(update);

		this.#fixedInterval = setInterval((): void => {
			if (!this.paused) {
				this.trigger(ComponentEvent.FixedUpdate);
			}
		}, 1000 / ups);
	}

	/** The rendering context of this Umbra instance. */
	readonly gl: WebGL2RenderingContext;

	/** The time in milliseconds that the update loops of this Umbra instance have been running. */
	time: number;

	/** The time in milliseconds between this frame and the last for this Umbra instance. */
	deltaTime: number;

	/** Whether to not trigger events on components on objects in the current scene of this Umbra instance. */
	paused: boolean;

	/** The frames per second of this Umbra instance. */
	get fps(): number {
		return 1 / this.deltaTime;
	}

	/** The top-level object of the current scene of this Umbra instance. */
	get scene(): GameObject {
		return this.#scene;
	}

	set scene(value: GameObject) {
		this.#scene = value;
		this.trigger(ComponentEvent.Load);
	}

	/**
	 * Triggers an event on every component on every object in the current scene of this Umbra instance.
	 * @param event - The event to trigger.
	 */
	trigger(event: ComponentEvent): void {
		const getComponentsRecursive = (gameObject: GameObject, output: Component[] = []): Component[] => {
			if (!gameObject?.enabled) {
				return output;
			}

			gameObject.components
				.filter((component: Component): boolean => component.events.has(event))
				.forEach((component: Component): void => {
					output.push(component);
				});

			for (const child of gameObject.children) {
				getComponentsRecursive(child, output);
			}

			return output;
		}

		getComponentsRecursive(this.scene)
			.sort((a: Component, b: Component): number => a.priority > b.priority ? 1 : -1)
			.forEach((component: Component): void => {
				component.events.get(event)(this);
			});
	}

	/** Stops all processes on this Umbra instance. */
	destroy(): void {
		clearInterval(this.#fixedInterval);
		this.#stopLoop = true;
	}
}