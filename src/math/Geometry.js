import { Vector } from "../math/Vector.js";
import { FLOAT, UNSIGNED_SHORT, UNSIGNED_INT, STATIC_DRAW, TRIANGLES } from "./constants.js";

// TODO: Can be converted to a private static property once Bundlephobia supports them.
let nextGeometryId = 0;

export class Geometry {
	constructor(renderer, attributeValues = {}) {
		// TODO: Update attributeValues to be more object-oriented. AttributeValue class.
		Object.assign(this, { renderer, gl: renderer.gl, attributeValues, id: nextGeometryId++, VAOs: new Map(),
			drawRange: { start: 0, count: 0 }, instancedCount: 0, /* isInstanced: null */ });

		gl.bindVertexArray(null);

		// Create buffers.
		for (const attributeName in attributeValues) {
			this.addAttribute(attributeName, attributeValues[attributeName]);
		}
	}

	addAttribute(name, value) {
		this.attributeValues[name] = value;

		// TODO: Can be compressed with logical OR assignments once Bundlephobia supports them.
		value.size = value.size || 1;
		value.type = value.type
			|| (value.data.constructor == Float32Array ? FLOAT
			: value.data.constructor == Uint16Array ? UNSIGNED_SHORT
			: UNSIGNED_INT); // Uint32Array
		value.target = name == "index" ? ELEMENT_ARRAY_BUFFER : ARRAY_BUFFER; // TODO: Document special attribute name.
		value.normalized = value.normalized || false;
		value.stride = value.stride || 0;
		value.offset = value.offset || 0;
		value.count = value.count || (value.stride ? value.data.byteLength / value.stride : value.data.length / value.size);
		value.divisor = value.instanced || 0;

		if (!value.buffer) {
			value.buffer = this.gl.createBuffer();
			this.updateAttribute(value);
		}

		// Update geometry counts.
		if (value.divisor) {
			this.isInstanced = true;
			if (this.instancedCount && this.instancedCount != value.count * value.divisor) {
				console.warn("Geometry has multiple instanced buffers of different length.");
				return (this.instancedCount = Math.min(this.instancedCount, value.count * value.divisor));
			}
			this.instancedCount = value.count * value.divisor;
		} else if (name == "index") {
			this.drawRange.count = value.count;
		} else if (!this.attributeValues.index) {
			this.drawRange.count = Math.max(this.drawRange.count, value.count);
		}
	}

	updateAttribute(attribute) {
		this.gl.bindBuffer(attribute.target, attribute.buffer);
		this.gl.bufferData(attribute.target, attribute.data, STATIC_DRAW);
	}

	setIndex(value) {
		this.addAttribute("index", value);
	}

	createVAO(program) {
		this.VAOs.set(program, this.gl.createVertexArray());
		this.gl.bindVertexArray(this.VAOs.get(program));
		this.bindAttributes(program);
	}

	bindAttributes(program) {
		// TODO
	}

	draw(program, mode = TRIANGLES) {
		// TODO
	}

	get position() {
		// TODO
	}

	computeBoundingBox(attribute) {
		// TODO
	}

	computeBoundingSphere(attribute) {
		// TODO
	}
}