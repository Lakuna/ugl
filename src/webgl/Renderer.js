import { CCW, LESS, MAX_COMBINED_TEXTURE_IMAGE_UNITS, MAX_TEXTURE_MAX_ANISOTROPY_EXT, TEXTURE0,
	FRAMEBUFFER, DEPTH_TEST, COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT, STENCIL_BUFFER_BIT } from "./constants.js";
import { makeFullscreenCanvas } from "./makeFullscreenCanvas.js";
import { BlendFunction } from "./BlendFunction.js";
import { BlendEquation } from "./BlendEquation.js";

// Note: The contents of this file are heavily based on work by the authors of OGL.

// TODO: Can be replaced with a static private variable when Bundlephobia supports it.
let nextRendererId = 0;

/*
Not automatic (must be implemented by developers):
- gl.colorMask(...);
- gl.clearColor(...);
- gl.stencilMask(...);
- gl.stencilFunc(...);
- gl.stencilOp(...);
- gl.clearStencil(...);
*/

export class Renderer {
	constructor({ canvas = makeFullscreenCanvas(), dpr = 1, alpha = false, depth = true, stencil = false, antialias = false,
		premultipliedAlpha = false, preserveDrawingBuffer = false, powerPreference = "default", autoClear = true } = {}) {

		const gl = canvas.getContext("webgl2", { alpha, depth, stencil, antialias, premultipliedAlpha, preserveDrawingBuffer, powerPreference });

		// Initialize extra format types.
		this.extensions = {};
		["EXT_color_buffer_float", "OES_texture_float_linear", "EXT_texture_filter_anisotropic"].forEach((extensionName) => this.extensions[extensionName] = gl.getExtension(extensionName));

		Object.assign(this, {
			dpr, alpha, color: true, depth, stencil, premultipliedAlpha, autoClear, id: nextRendererId++, gl, canvas,
			state: {
				blendFunction: new BlendFunction(gl),
				blendEquation: new BlendEquation(gl),
				/* cullFace: null, */
				frontFace: CCW,
				depthMask: true,
				depthFunction: LESS,
				/* framebuffer: null, */
				textureUnits: [],
				activeTextureUnit: 0
			},
			parameters: { maxTextureUnits: gl.getParameter(MAX_COMBINED_TEXTURE_IMAGE_UNITS), maxAnisotropy: gl.getParameter(MAX_TEXTURE_MAX_ANISOTROPY_EXT) }
		});

		// Set initial size.
		this.resize();
	}

	resize() {
		this.canvas.width = this.canvas.clientWidth * this.dpr;
		this.canvas.height = this.canvas.clientHeight * this.dpr;

		this.gl.viewport(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
	}

	setFeatureEnabled(id, enable = true) {
		if (enable) { this.gl.enable(id); } else { this.gl.disable(id); }
		this.state[id] = enable;
	}

	set cullFace(value) {
		this.state.cullFace = value;
		this.gl.cullFace(value);
	}

	set frontFace(value) {
		this.state.frontFace = value;
		this.gl.frontFace(value);
	}

	set depthMask(value) {
		this.state.depthMask = value;
		this.gl.depthMask(value);
	}

	set depthFunction(value) {
		this.state.depthFunction = value;
		this.gl.depthFunc(value);
	}

	set activeTexture(value) {
		this.state.activeTextureUnit = value;
		this.gl.activeTexture(TEXTURE0 + value);
	}

	set blendFunction(value) {
		this.state.blendFunction = value;
		this.state.blendFunction.update();
	}

	set blendEquation(value) {
		this.state.blendEquation = value;
		this.state.blendEquation.update();
	}

	bindFramebuffer(buffer, target = FRAMEBUFFER) {
		this.state.framebuffer = buffer;
		this.gl.bindFramebuffer(target, buffer);
	}

	getRenderList({ scene, camera, frustumCull, sort } = {}) {
		let renderList = [];

		// Frustum culling.
		if (camera && frustumCull) { camera.updateFrustum(); }

		// Get visible nodes.
		scene.traverse((node) => {
			if (!node.visible) { return true; }
			if (!node.draw) { return; }

			// TODO: Can be minified with optional chaining once Bundlephobia supports it.
			if (frustumCull && node.frustumCulled && camera) {
				if (!camera.frustumIntersectsMesh(node)) { return; }
			}

			renderList.push(node);
		});

		// Organize nodes into three render groups (opaque, transparent, UI).
		if (sort) {
			const opaqueRenderGroup = [];
			const transparentRenderGroup = [];
			const uiRenderGroup = [];
			renderList.forEach((node) => {
				if (!node.program.transparent) {
					opaqueRenderGroup.push(node);
				} else if (node.program.depthTest) {
					transparentRenderGroup.push(node);
				} else {
					uiRenderGroup.push(node);
				}

				// Calculate Z depth.
				node.zDepth = (node.renderOrder != 0 || !node.program.depthTest || !camera)
					? 0
					: node.worldMatrix.translation.transform(camera.projectionViewMatrix)[2];
			});

			// Sort and concatenate.
			opaqueRenderGroup.sort((a, b) => a.renderOrder - b.renderOrder || a.program.id - b.program.id || a.zDepth - b.zDepth || b.id - a.id);
			transparentRenderGroup.sort((a, b) => a.renderOrder - b.renderOrder || b.zDepth - a.zDepth || b.id - a.id);
			uiRenderGroup.sort((a, b) => a.renderOrder - b.renderOrder || a.program.id - b.program.id || b.id - a.id);
			renderList = opaqueRenderGroup.concat(transparentRenderGroup, uiRenderGroup);
		}

		return renderList;
	}

	render({ scene, camera, frustumCull = true, sort = true, target, update = true, clear } = {}) {
		this.bindFramebuffer(target);
		
		// Clear the screen.
		// TODO: Can be minified with a nullish coalescing operator once Bundlephobia supports it.
		if (clear || (this.autoClear && clear != false)) {
			if (this.contextAttributes.depth && (!target || target.depth)) {
				this.setFeatureEnabled(DEPTH_TEST, true);
				this.setDepthMask(true);
			}

			this.gl.clear(
				(this.color ? COLOR_BUFFER_BIT : 0)
				| (this.contextAttributes.depth ? DEPTH_BUFFER_BIT : 0)
				| (this.contextAttributes.stencil ? STENCIL_BUFFER_BIT : 0));
		}

		// Update all scene graph matrices.
		if (update) { scene.updateMatrixWorld(); }

		// Update the camera separately in case it isn't in the scene graph.
		if (camera) { camera.updateMatrixWorld(); }

		// Get render list and draw.
		this.getRenderList({ scene, camera, frustumCull, sort }).forEach((node) => node.draw({ camera }));
	}
}