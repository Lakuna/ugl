import {
	OBJECT_TYPE,
	SYNC_CONDITION,
	SYNC_FENCE,
	SYNC_FLAGS,
	SYNC_FLUSH_COMMANDS_BIT,
	SYNC_GPU_COMMANDS_COMPLETE,
	SYNC_STATUS,
	TIMEOUT_IGNORED
} from "../constants/constants.js";
import type Context from "./Context.js";
import ContextDependent from "./internal/ContextDependent.js";
import type SyncClientStatus from "../constants/SyncClientStatus.js";
import type SyncStatus from "../constants/SyncStatus.js";
import UnsupportedOperationError from "../utility/UnsupportedOperationError.js";

/**
 * A sync object.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLSync | WebGLSync}
 * @public
 */
export default class Sync extends ContextDependent {
	/**
	 * Create a sync object.
	 * @param context - The rendering context.
	 * @throws {@link UnsupportedOperationError} if the sync object can't be created.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/fenceSync | fenceSync}
	 */
	public constructor(context: Context) {
		super(context);

		const internal = this.gl.fenceSync(SYNC_GPU_COMMANDS_COMPLETE, 0);
		if (!internal) {
			throw new UnsupportedOperationError(
				"The environment does not support sync objects."
			);
		}

		this.internal = internal;
	}

	private internal: WebGLSync;

	/** Whether or not this is a valid sync object. */
	public get isValid(): boolean {
		return this.gl.isSync(this.internal);
	}

	/** The type of this sync object. Always `SYNC_FENCE`. */
	public get type(): typeof SYNC_FENCE {
		return this.context.doPrefillCache
			? SYNC_FENCE
			: (this.gl.getSyncParameter(
					this.internal,
					OBJECT_TYPE
				) as typeof SYNC_FENCE);
	}

	/** The status of this sync object. */
	public get status(): SyncStatus {
		return this.gl.getSyncParameter(this.internal, SYNC_STATUS) as SyncStatus;
	}

	/** The condition of this sync object. Always `SYNC_GPU_COMMANDS_COMPLETE`. */
	public get condition(): typeof SYNC_GPU_COMMANDS_COMPLETE {
		return this.context.doPrefillCache
			? SYNC_GPU_COMMANDS_COMPLETE
			: (this.gl.getSyncParameter(
					this.internal,
					SYNC_CONDITION
				) as typeof SYNC_GPU_COMMANDS_COMPLETE);
	}

	/** The flags with which this sync object was created. Always `0` as no flags are supported. */
	public get flags(): 0 {
		return this.context.doPrefillCache
			? 0
			: (this.gl.getSyncParameter(this.internal, SYNC_FLAGS) as 0);
	}

	/**
	 * Wait on the client for this sync object to become signaled or for the given timeout to be passed.
	 * @param flush - Whether or not to flush commands.
	 * @param timeout - The timeout in nanoseconds to wait for the sync object to become signaled.
	 * @returns This sync object's status.
	 * @throws {@link BadValueError} if `timeout` exceeds the maximum client wait timeout.
	 */
	public clientWait(flush = false, timeout = 1000000): SyncClientStatus {
		return this.gl.clientWaitSync(
			this.internal,
			flush ? SYNC_FLUSH_COMMANDS_BIT : 0,
			timeout
		);
	}

	/**
	 * Wait on the GL server for this sync object to become signaled.
	 * @returns This sync object's status.
	 */
	public wait(): void {
		this.gl.waitSync(this.internal, 0, TIMEOUT_IGNORED);
	}

	/**
	 * Delete this sync object.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/deleteSync | deleteSync}
	 */
	public delete(): void {
		this.gl.deleteSync(this.internal);
	}
}
