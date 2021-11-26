import { Event } from "./Event.js";
import { makeFullscreenCanvas } from "../utility/makeFullscreenCanvas.js";
import { GameObject } from "./GameObject.js";
import { Component } from "./Component.js";
import { UnsupportedError } from "../utility/UnsupportedError.js";

/** A controller for a program which uses Umbra. */
export class Umbra {
	#scene: GameObject | undefined;
	readonly #fixedInterval: number;
	#stopLoop: boolean;
	#then: number;

	#update(now: number): void {
		if (!this.#stopLoop) { requestAnimationFrame(this.#update); }

		this.time = now;
		this.deltaTime = now - this.#then;
		this.#then = now;

		if (!this.paused) {
			this.trigger(Event.Update);
		}
	}

	#fixedUpdate(): void {
		if (!this.paused) {
			this.trigger(Event.FixedUpdate);
		}
	}

	/**
	 * Creates an Umbra program.
	 * @param canvas - The canvas for the instance to render to.
	 * @param ups - The number of updates per second for the fixed update loop.
	 */
	constructor(canvas: HTMLCanvasElement | undefined = makeFullscreenCanvas(), ups = 30) {
		if (canvas) {
			const context: WebGL2RenderingContext | null = canvas.getContext("webgl2");
			if (context) { this.gl = context; } else { throw new UnsupportedError("WebGL2 is not supported by your browser"); }
		}

		this.#stopLoop = false;

		this.time = 0;
		this.deltaTime = 0;
		this.paused = false;
		this.#then = 0;

		requestAnimationFrame(this.#update);
		this.#fixedInterval = setInterval(this.#fixedUpdate, 1000 / ups);
	}

	/** The rendering context of this instance. */
	readonly gl?: WebGL2RenderingContext;

	/** The time in milliseconds that the update loop of this instance has been active. */
	time: number;

	/** The time in milliseconds between this frame and the last for this instance. */
	deltaTime: number;

	/** Whether or not to prevent triggering events. */
	paused: boolean;

	/** The frames per second of this instance. */
	get fps(): number {
		return 1000 / this.deltaTime;
	}

	/** The top-level game object of the current scene of this instance. */
	get scene(): GameObject | undefined {
		return this.#scene;
	}

	set scene(value: GameObject | undefined) {
		this.#scene = value;
		if (value) {
			this.trigger(Event.Load);
		}
	}

	#getComponentsRecursive(gameObject: GameObject, event: Event, output: Component[] = []): Component[] {
		if (!gameObject?.enabled) { return output; }

		gameObject.components
			.filter((component: Component): boolean => component.events.has(event))
			.forEach((component: Component): void => { output.push(component); })

		for (const child of gameObject.children) { this.#getComponentsRecursive(child, event, output); }

		return output;
	}

	/** Triggers an event.
	 * @param event - The event to trigger.
	 */
	trigger(event: Event): void {
		if (!this.#scene) { return; }

		this.#getComponentsRecursive(this.#scene, event)
			.sort((a: Component, b: Component): number => a.priority > b.priority ? 1 : -1)
			.forEach((component: Component): void => { component.events.get(event)?.(this); });
	}

	/** Stops all loops on this instance. */
	destroy(): void {
		clearInterval(this.#fixedInterval);
		this.#stopLoop = true;
	}
}