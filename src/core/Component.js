export class Component {
	static events = {
		UPDATE: Symbol("Update"),
		FIXED_UPDATE: Symbol("Fixed update"),
		LOAD: Symbol("Load")
	};

	constructor(gameObject, priority = 0) {
		Object.defineProperties(this, {
			gameObject: { value: gameObject },
			priority: { value: priority, writable: true }
		});
	}
}