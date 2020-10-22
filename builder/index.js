const readline = require('readline');
const bent = require('bent');
const uglify = require('uglify-es');
const fs = require('fs');
const columnify = require('columnify');

const API = 'https://www.lakuna.pw/api/umbra.json';
const REQUIRED_TAG_NAME = 'REQUIRED';
const LOCAL_VERSION_NAME = 'local';
const LOCAL_FILE_NAME = 'umbra.js';

const getJson = bent('json');

const logError = (message, err) => {
	const endString = '\n---\n';

	let output = endString;
	if (message) {
		output += message;
		if (err) { output += '\n\t'; }
	}
	if (err) { output += err; }
	output += endString;

	console.error(output);
}

const versionInformation = async () => {
	return await getJson(API).catch((err) => {
		// Use offline mode if the request fails.
		logError('Failed API request. Using offline mode.', err);

		return {
			latest: LOCAL_VERSION_NAME,
			recommended: LOCAL_VERSION_NAME,
			releases: []
		};
	});
}

const start = async () => {
	const verInfo = await versionInformation();

	// TODO
}
start();
