/**
 * Sync object statuses.
 * @public
 */
enum SyncStatus {
	/** The sync has not completed. */
	UNSIGNALED = 0x9118,

	/** The sync has completed. */
	SIGNALED = 0x9119
}

export default SyncStatus;
