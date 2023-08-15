import type Mip from "#Mip";
import type Mipmap from "#Mipmap";
import type Renderbuffer from "#Renderbuffer";

/** An attachment for a framebuffer. */
export type FramebufferAttachment = Mip | Mipmap<Mip> | Renderbuffer;
