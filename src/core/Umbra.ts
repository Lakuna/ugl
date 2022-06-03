import { GameObject } from "./GameObject.js";
import { Component, Event } from "./Component.js";

/** A controller for a program which uses Umbra. */
export class Umbra {
  /**
   * Creates an instance of Umbra.
   * @param canvas - The canvas to render to.
   * @param ups - The updates per second of the fixed update loop.
   */
  public constructor(canvas: HTMLCanvasElement, ups = 30) {
    this.canvas = canvas;
    this.ups = ups;

    const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2");
    if (!gl) { throw new Error("WebGL2 is not supported by your browser."); }
    this.gl = gl;

    this.stopLoop = false;
    this.time = 0;
    this.deltaTime = 0;
    this.paused = false;
    let then = 0;

    // Update loop.
    const update: (now: number) => void = (now: number): void => {
      if (!this.stopLoop) { requestAnimationFrame(update); }

      this.time = now;
      this.deltaTime = now - then;
      then = now;

      if (!this.paused) { this.trigger(Event.Update); }
    };
    requestAnimationFrame(update);

    // Fixed update loop.
    this.fixedInterval = setInterval((): void => {
      if (!this.paused) { this.trigger(Event.FixedUpdate); }
    }, 1000 / ups);
  }

  /** The canvas. */
  public readonly canvas: HTMLCanvasElement;

  /** The number of updates per second of the fixed update loop. */
  public readonly ups: number;

  /** The rendering context. */
  public readonly gl: WebGL2RenderingContext;

  /** Whether the update loop is set to be stopped. */
  private stopLoop: boolean;

  /** The time in milliseconds that the update loop has been active. */
  public time: number;

  /** The time in milliseconds between the current frame and the last one. */
  public deltaTime: number;

  /** Whether to not trigger update events. */
  public paused: boolean;

  /** The fixed update interval. */
  private readonly fixedInterval: number;

  /** The frames per second. */
  public get fps(): number {
    return 1000 / this.deltaTime;
  }

  /** The top-level object of the current scene. */
  private scenePrivate: GameObject | undefined;

  /** The top-level object of the current scene. */
  public get scene(): GameObject | undefined {
    return this.scenePrivate;
  }

  public set scene(value: GameObject | undefined) {
    this.scenePrivate = value;
    if (value) { this.trigger(Event.Load); }
  }

  /**
   * Triggers an event on every component on every object in the current scene.
   * @param event - The event to trigger.
   */
  public trigger(event: Event): void {
    if (!this.scenePrivate) { return; }

    // Gets all components in the scene recursively.
    function getComponents(gameObject: GameObject, output: Array<Component> = []): Component[] {
      if (!gameObject?.enabled) { return output; }

      for (const component of gameObject.components.filter((component: Component): boolean => component.events.has(event))) {
        output.push(component);
      }

      for (const child of gameObject.children) {
        getComponents(child, output);
      }

      return output;
    }

    for (const component of getComponents(this.scenePrivate).sort((a: Component, b: Component): number => a.priority > b.priority ? 1 : -1)) {
      (component.events.get(event) as (umbra: Umbra) => void)(this);
    }
  }

  /** Permanently stops the update loops on this Umbra instance. */
  public destroy(): void {
    clearInterval(this.fixedInterval);
    this.stopLoop = true;
  }
}
