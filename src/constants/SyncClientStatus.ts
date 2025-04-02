/**
 * Sync object statuses.
 * @public
 */
enum SyncClientStatus {
	/** The sync object was already signaled when the method was called. */
	ALREADY_SIGNALED = 0x911a,

	/** The timeout time passed without the sync object becoming signaled. */
	TIMEOUT_EXPIRED = 0x911b,

	/** The sync object became signaled before the timeout expired. */
	CONDITION_SATISFIED = 0x911c,

	/** An error occurred during execution. */
	WAIT_FAILED = 0x911d
}

export default SyncClientStatus;
