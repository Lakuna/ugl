import { ONE, ZERO, FUNC_ADD, CCW, LESS, MAX_COMBINED_TEXTURE_IMAGE_UNITS, MAX_TEXTURE_MAX_ANISOTROPY_EXT, TEXTURE0,
	FRAMEBUFFER, DEPTH_TEST, COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT, STENCIL_BUFFER_BIT } from "./constants.js";
import { makeFullscreenCanvas } from "./makeFullscreenCanvas.js";

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
	constructor({ canvas = makeFullscreenCanvas(), alpha = false, depth = true, stencil = false, antialias = false,
		premultipliedAlpha = false, preserveDrawingBuffer = false, powerPreference = "default" } = {}) {

		const contextAttributes = { alpha, depth, stencil, antialias, premultipliedAlpha, preserveDrawingBuffer, powerPreference };
		const gl = canvas.getContext("webgl2", contextAttributes);

		Object.assign(this, {
			contextAttributes, color: true, autoClear: true, id: nextRendererId++, gl,
			state: {
				blendFunction: { source: ONE, destination: ZERO, /* sourceAlpha: null, */ /* destinationAlpha: null */ },
				blendEquation: { modeRGB: FUNC_ADD },
				/* cullFace: null, */ frontFace: CCW,
				depthMask: true, depthFunction: LESS,
				premultiplyAlpha: false,
				flipY: false,
				unpackAlignment: 4,
				/* framebuffer: null, */
				textureUnits: [], activeTextureUnit: 0,
				/* boundBuffer: null, */
				uniformLocations: new Map()
			},
			extensions: {},
			parameters: { maxTextureUnits: gl.getParameter(MAX_COMBINED_TEXTURE_IMAGE_UNITS), maxAnisotropy: gl.getParameter(MAX_TEXTURE_MAX_ANISOTROPY_EXT) }
		});

		// Initialize extra format types.
		["EXT_color_buffer_float", "OES_texture_float_linear"].forEach((extensionName) => this.extensions[extensionName] = gl.getExtension(extensionName));

		// Create method aliases.
		["vertexAttribDivisor", "drawArraysInstanced", "drawElementsInstanced", "createVertexArray", "bindVertexArray", "deleteVertexArray", "drawBuffers"]
			.forEach((methodName) => this[methodName] = gl[methodName].bind(gl));
	}

	resize() {
		const canvas = this.gl.canvas;

		const displayWidth = canvas.clientWidth;
		const displayHeight = canvas.clientHeight;

		if (canvas.width != displayWidth || canvas.height != displayHeight) {
			this.width = displayWidth;
			this.height = displayHeight;

			canvas.width = displayWidth;
			canvas.height = displayHeight;

			this.gl.viewport(0, 0, displayWidth, displayHeight);
		}
	}

	toggleFeature(feature, enable) {
		if (enable) { this.gl.enable(id); } else { this.gl.disable(id); }
		this.state[id] = enable;
	}

	setBlendFunction(source, destination, sourceAlpha, destinationAlpha) {
		Object.assign(this.state.blendFunction, { source, destination, sourceAlpha, destinationAlpha });
		if (sourceAlpha) { this.gl.blendFuncSeparate(source, destination, sourceAlpha, destinationAlpha); } else { this.gl.blendFunc(source, destination); }
	}

	// TODO: Convert to setter.
	setCullFace(value) {
		this.state.cullFace = value;
		this.gl.cullFace(value);
	}

	// TODO: Convert to setter.
	setFrontFace(value) {
		this.state.frontFace = value;
		this.gl.frontFace(value);
	}

	// TODO: Convert to setter.
	setDepthMask(value) {
		this.state.depthMask = value;
		this.gl.depthMask(value);
	}

	// TODO: Convert to setter.
	setDepthFunction(value) {
		this.state.depthFunction = value;
		this.gl.depthFunc(value);
	}

	// TODO: Convert to setter.
	activeTexture(value) {
		this.state.activeTextureUnit = value;
		this.gl.activeTexture(TEXTURE0 + value);
	}

	bindFramebuffer(target = FRAMEBUFFER, buffer) {
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

			// Can be minified with optional chaining once Bundlephobia supports it.
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
					: node.zDepth = node.worldMatrix.translation.transform(camera.projectionViewMatrix)[2];
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
		this.resize();
		
		// Clear the screen.
		if (clear ?? this.autoClear) {
			if (this.contextAttributes.depth && (!target || target.depth)) {
				this.toggleFeature(DEPTH_TEST, true);
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