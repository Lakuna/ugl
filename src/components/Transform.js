import { Component } from "../core/Component.js";
import { Vector } from "../math/Vector.js";
import { Euler } from "../math/Euler.js";

export class Transform extends Component {
	constructor() {
		Object.defineProperties(this, {
			translation: { value: new Vector(0, 0, 0) },
			rotation: { value: new Euler(0, 0, 0) },
			scale: { value: new Vector(1, 1, 1) }
		});
	}
}