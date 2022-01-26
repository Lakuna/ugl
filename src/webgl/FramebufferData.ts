import { Renderbuffer } from "./Renderbuffer.js";
import { Texture } from "./Texture.js";

/** Data that can be stored in a framebuffer. */
export type FramebufferData = Texture | Renderbuffer;