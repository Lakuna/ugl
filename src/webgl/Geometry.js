import { Vector } from "../math/Vector.js";
import { FLOAT, UNSIGNED_SHORT, UNSIGNED_INT, ELEMENT_ARRAY_BUFFER, ARRAY_BUFFER, STATIC_DRAW, TRIANGLES, FLOAT_MAT2, FLOAT_MAT3, FLOAT_MAT4 } from "./constants.js";

// TODO: Can be converted to a private static property once Bundlephobia supports them.
let nextGeometryId = 0;

export class Geometry {
	constructor(renderer, attributeValues = {}) {
		// TODO: Update attributeValues to be more object-oriented. AttributeValue class.
		// TODO: data setter on Attribute or AttributeValue class which supplies data to the buffer.
		Object.assign(this, { renderer, gl: renderer.gl, attributeValues, id: nextGeometryId++, VAOs: new Map(),
			drawRange: { start: 0, count: 0 }, instancedCount: 0, /* isInstanced: null, */ /* bounds: { min: null, max: null, center: null, scale: null, radius: null } */ });

		this.gl.bindVertexArray(null);

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
		} else if (!this.attributeValues["index"]) {
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
		// Set attributes from values.
		for (const attribute of program.attributes.values()) {
			const value = this.attributeValues[attribute.activeInfo.name];
			if (!value) { throw new Error(`Attribute "${attribute.activeInfo.name}" is not being supplied.`); }

			this.gl.bindBuffer(value.target, value.buffer);

			// For matrix attributes, the buffer needs to be defined per-column.
			const numLoc =
				attribute.type == FLOAT_MAT2 ? 2 : (
				attribute.type == FLOAT_MAT3 ? 3 : (
				attribute.type == FLOAT_MAT4 ? 4 :
				1));

			const size = value.size / numLoc;
			const stride = numLoc == 1 ? 0 : numLoc ** 3;
			const offset = numLoc == 1 ? 0 : numLoc ** 2;

			for (let i = 0; i < numLoc; i++) {
				this.gl.vertexAttribPointer(attribute.location + i, size, value.type, value.normalized, value.stride + stride, value.offset + i * offset);
				this.gl.enableVertexAttribArray(location + i);

				// For instanced attributes, divisor needs to be set.
				this.gl.vertexAttribDivisor(location + i, value.divisor);
			}
		}

		// Bind indices if geometry is indexed.
		if (this.attributeValues["index"]) { this.gl.bindBuffer(ELEMENT_ARRAY_BUFFER, this.attributeValues["index"].buffer); }
	}

	draw(program, mode = TRIANGLES) {
		if (!this.VAOs.get(program)) { this.createVAO(program); }
		this.gl.bindVertexArray(this.VAOs.get(program));

		program.attributes.forEach((attribute) => this.updateAttribute(attribute));

		if (this.isInstanced) {
			if (this.attributeValues["index"]) {
				this.gl.drawElementsInstanced(mode, this.drawRange.count, this.attributeValues["index"].type, this.attributeValues["index"].offset + this.drawRange.start * 2);
			} else {
				this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
			}
		}
	}

	get position() {
		return this.attributeValues["position"].data; // TODO: Document special attribute name.
	}

	computeBoundingBox(attribute = this.position) {
		this.bounds = {
			min: new Vector(+Infinity),
			max: new Vector(-Infinity),
			// center: new Vector(),
			// scale: new Vector(),
			radius: Infinity
		};

		for (let i = attribute.offset || 0; i < attribute.data.length; i += attribute.stride || attribute.size) {
			const point = new Vector(attribute.data[i], attribute.data[i + 1], attribute.data[i + 2]);

			this.bounds.min[0] = Math.min(point[0], this.bounds.min[0]);
			this.bounds.min[1] = Math.min(point[1], this.bounds.min[1]);
			this.bounds.min[2] = Math.min(point[2], this.bounds.min[2]);

			this.bounds.max[0] = Math.max(point[0], this.bounds.max[0]);
			this.bounds.max[1] = Math.max(point[1], this.bounds.max[1]);
			this.bounds.max[2] = Math.max(point[2], this.bounds.max[2]);
		}

		this.bounds.scale = new Vector(...this.bounds.max).subtract(this.bounds.min);
		this.bounds.center = new Vector(...this.min).add(this.max).scale(1 / 2);
	}

	computeBoundingSphere(attribute = this.position) {
		if (!this.bounds) { this.computeBoundingBox(attribute); }

		for (let i = attribute.offset || 0; i < attribute.data.length; i += attribute.stride || attribute.size) {
			this.bounds.radius = Math.max(this.bounds.radius, this.bounds.center.distance(new Vector(attribute.data[i], attribute.data[i + 1], attribute.data[i + 2])));
		}
	}
}