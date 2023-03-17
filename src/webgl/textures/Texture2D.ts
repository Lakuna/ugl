import { TextureFilter, UNPACK_ALIGNMENT } from "../WebGLConstant.js";
import SingleSourceTexture from "./SingleSourceTexture.js";

/** A two-dimensional texture. */
export default class Texture2D extends SingleSourceTexture {
	/** Updates the texels of this texture. */
	protected updateInternal(): void {
		this.bind();

		if (this.width && this.height) {
			if (this.height > 1) { // Unpack alignment doesn't apply to the last row.
				for (const alignment of [8, 4, 2, 1]) {
					if (this.width % alignment == 0) {
						this.gl.pixelStorei(UNPACK_ALIGNMENT, alignment);
						break;
					}
				}
			}

			this.gl.texImage2D(this.target, this.lod, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.source as ArrayBufferView);
		} else {
			this.gl.texImage2D(this.target, this.lod, this.internalFormat, this.format, this.type, this.source as ImageData);
		}

		if (this.minFilter != TextureFilter.LINEAR && this.minFilter != TextureFilter.NEAREST) {
			this.generateMipmap();
		}
	}
}
