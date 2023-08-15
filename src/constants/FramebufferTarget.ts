/** Binding points for framebuffers. */
const enum FramebufferTarget {
    /** A collection buffer data storage of color, alpha, depth, and stencil buffers used to render an image. */
    FRAMEBUFFER = 0x8D40,

    /** Used as a destination for drawing, rendering, clearing, and writing operations. */
    DRAW_FRAMEBUFFER = 0x8CA9,

    /** Used as a source for reading operations. */
    READ_FRAMEBUFFER = 0x8CA8
}

export default FramebufferTarget;
