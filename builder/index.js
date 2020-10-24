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
const getString = bent('string');

// Print errors in a readable format.
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
};

// Get information from the API.
const apiInformation = async () => {
	return await getJson(API).catch((err) => {
		// Use offline mode if the request fails.
		logError('Failed API request. Using offline mode.', err);

		return { latest: LOCAL_VERSION_NAME, recommended: LOCAL_VERSION_NAME, releases: [] };
	});
};

// Create a map of Umbra version IDs to URLs.
const versionInformation = (apiInformation) => {
	let output = [{ id: LOCAL_VERSION_NAME, url: LOCAL_FILE_NAME }];
	apiInformation.releases.forEach((release) => {
		release.versions.forEach((version) => output.push({ id: `${release.release}-${version.name}`, url: version.url }));
	});
	return output;
};

// Select an Umbra version to build.
const chooseVersion = async (apiInformation, versionInformation) => {
	console.log(
			`${columnify(versionInformation)}\n\n` +
			`Latest release: ${apiInformation.latest}\n` +
			`Recommended version: ${apiInformation.recommended}\n` +
			'\n' +
			'Select version:'
	);

	let selectedVersion;

	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	for await (const line of rl) {
		if (!line) {
			// Use the recommended version by default.
			selectedVersion = versionInformation.find((version) => version.id == apiInformation.recommended);
			console.log(`Using recommended version: ${selectedVersion.id}`);
			break;
		}

		selectedVersion = versionInformation.find((version) => version.id == line);
		if (selectedVersion) { break; } else { console.log(`"${line}" is not a known version.`); }
	}

	return selectedVersion;
};

// Get the text for a version of Umbra.
const getScript = async (version) => {
	if (version.url == LOCAL_FILE_NAME) {
		return fs.readFileSync(version.url, { encoding: 'utf8' });
	} else {
		return await getString(version.url).catch((err) => logError(`Error getting URL: ${version.url}`, err));
	}
};

// Separate the script text into lines with code and comments.
const parseScript = (script) => {
	let parsedLines = [];

	let multilineComment = false;
	script.split(/[\r\n]+/).forEach((line) => {
		line = line.trim();
		let parsedLine = { code: '', comment: '' };

		let comment = false;
		line.split(/ +/).forEach((word) => {
			word = word.trim();

			// Check if word is commented.
			if (word.startsWith('//')) {
				comment = true;
				word = word.substring('//'.length);
			} else if (word.startsWith('/*')) {
				multilineComment = true;
				word = word.substring('/*'.length);
			} else if (word.startsWith('*/')) {
				multilineComment = false;
				word = word.substring('*/'.length);
			}

			if (word.length <= 0) { return; } // Skip empty words.

			if (multilineComment || comment) { parsedLine.comment += `${word} `; } else { parsedLine.code += `${word} `; }
		});

		parsedLines.push(parsedLine);
	});

	return parsedLines;
};

// Get a list of tags in an Umbra scripts.
const getTags = (parsedScript) => {
	let tags = [];

	parsedScript.forEach((line) => {
		const comment = line.comment.split(/ +/);
		const operator = comment[0];
		const propertyName = comment[1];
		const tagName = comment[2];
		const data = comment.slice(3).join(' ').trim();

		if (operator != 'UTAGDEF') { return; }

		// Find or create tag.
		let tag = tags.find((tag) => tag.name == tagName);
		if (!tag) {
			tag = { name: tagName, description: '', size: 0, requires: [], link: '' };
			tags.push(tag);
		}

		switch (propertyName) {
			case 'DESC':
				tag.description = data;
				break;
			case 'REQU':
				const requirementTag = tags.find((tag) => tag.name == data);
				if (!requirementTag) { return logError(`Unable to require tag "${data}".`); }
				tag.requires.push(requirementTag.name);
				break;
			case 'LINK':
				tag.link = data;
				break;
			case 'SIZE':
				console.log(`Skipping deprecated property "${propertyName}".`);
				break;
			default:
				logError(`Skipping unknown property "${propertyName}".`);
				break;
		}
	});

	return tags;
};

// Load external code into marked tags.
const loadTagLinks = async (parsedScript, tags) => {
	for (const tag of tags) {
		if (!tag.link) { continue; }

		const loadedScript = await getString(tag.link).catch((err) => logError(`Error getting script linked by tag "${tag.name}" from URL: ${tag.link}`, err));

		parsedScript = parsedScript.concat([
			{ code: '', comment: `UTAGSET START ${tag.name}` },
			{ code: loadedScript, comment: '' },
			{ code: '', comment: `UTAGSET END ${tag.name}` }
		]);
	}

	return parsedScript;
};

// Assign tags to lines.
const tagLines = (parsedScript, tags) => {
	let multilineTags = [];
	parsedScript.forEach((line) => {
		let lineTags = [];

		const comment = line.comment.split(/ +/);
		const operator = comment[0];
		const propertyName = comment[1];
		const tagName = comment[2];

		if (operator == 'UTAGSET') {
			let tag = tags.find((tag) => tag.name == tagName);
			if (!tag) { return logError(`Failed to set line tag "${tagName}".`); }

			switch (propertyName) {
				case 'START':
					multilineTags.push(tag.name);
					break;
				case 'END':
					multilineTags = multilineTags.filter((multilineTag) => multilineTag != tag.name);
					lineTags.push(tag.name);
					break;
				case 'LINE':
					lineTags.push(tag.name)
					break;
				default:
					logError(`Skipping unknown property "${propertyName}".`);
					break;
			}
		}

		// Assign tags to line.
		line.tags = [];
		multilineTags.forEach((tag) => line.tags.push(tag));
		lineTags.forEach((tag) => line.tags.push(tag));
	});

	return parsedScript;
};

// Recursively add a tag and its dependencies to a list.
const tagDependencies = (tag, tags, includeTag, output) => {
	let toAdd = [tag, tags.find((tag) => tag.name == REQUIRED_TAG_NAME)];
	while (toAdd.length > 0) {
		const addingTag = toAdd.shift();
		if (output.includes(addingTag)) { continue; }
		output.push(addingTag);

		addingTag.requires.forEach((requiresTagName) => {
			const requiresTag = tags.find((tag) => tag.name == requiresTagName);
			if (!requiresTag) { return logError(`Error getting required tag "${requiresTagName}" for tag "${addingTag.name}".`); }
			tagDependencies(requiresTag, tags, true, output);
		});
	}

	if (!includeTag) { output = output.splice(output.indexOf(tag), 1); }

	return output;
}

// Uglify a script and cut out unused tags.
const compileScript = (parsedScript, includedTagNames, doUglify) => {
	let output = '';

	parsedScript.forEach((line) => {
		if (!line.tags.some((tag) => includedTagNames.includes(tag))) { return; }

		output += line.code;
		if (!doUglify && line.comment) {
			if (line.code) { output += ' '; }
			output += `// ${line.comment}`;
		}
		output += '\n';
	});

	if (doUglify) {
		const uglified = uglify.minify(output);
		if (uglified.error) { logError('Failed to uglify script.', uglified.error); } else { output = uglified.code; }
	}

	return output;
}

// Get file size of each tag.
const measureTags = (parsedScript, tags) => {
	tags.forEach((tag) => {
		let inclusiveTags = [];
		let temp = [];
		tagDependencies(tag, tags, true, temp);
		temp.forEach((tag) => inclusiveTags.push(tag.name));

		let exclusiveTags = [];
		temp = [];
		tagDependencies(tag, tags, false, temp);
		temp.forEach((tag) => exclusiveTags.push(tag.name));

		let inclusiveSize = compileScript(parsedScript, inclusiveTags, true).length;
		let exclusiveSize = compileScript(parsedScript, exclusiveTags, true).length;
		tag.size = inclusiveSize - exclusiveSize;
	});

	return tags;
};

// Choose settings for compiling script.
const chooseCompileSettings = async (tags) => {
	console.log(
			'\n' +
			`${columnify(tags, { columns: ['name', 'description', 'size', 'requires'] })}\n\n` +
			`The "${REQUIRED_TAG_NAME}" tag is always included.\n` +
			'Tag requirements are automatically included.\n' +
			'Use an asterisk (*) to include every tag.\n' +
			'Use an exclamation point (!) to prevent uglifying the code.\n' +
			'Type "compile" to finish specifying settings.' +
			'\n' +
			'Compile settings:'
	);

	const requiredTag = tags.find((tag) => tag.name == REQUIRED_TAG_NAME);
	if (!requiredTag) { return logError(`Unable to find required tag "${REQUIRED_TAG_NAME}".`); }
	let output = { usedTags: [requiredTag], doUglify: true };

	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	for await (const line of rl) {
		if (line == '*') {
			tags.forEach((tag) => tagDependencies(tag, tags, true, output.usedTags));
			console.log('Including all tags.');
		} else if (line == '!') {
			output.doUglify = false;
			console.log('Not uglifying output.');
		} else if (line == 'compile') {
			console.log(
					'\n' +
					`Compiling Umbra to ${LOCAL_FILE_NAME}...\n` +
					`Uglify output: ${output.doUglify}\n` +
					'Tags:'
			);
			output.usedTags.forEach((tag) => console.log(`\t${tag.name}`));

			break;
		} else {
			const addingTag = tags.find((tag) => tag.name.toLowerCase() == line.toLowerCase());
			if (!addingTag) {
				console.log(`Unable to include tag "${line}".`);
				continue;
			}
			tagDependencies(addingTag, tags, true, output.usedTags);
			console.log(`Including tag ${addingTag.name} and its dependencies.`);
		}
	}

	output.usedTagNames = [];
	output.usedTags.forEach((tag) => output.usedTagNames.push(tag.name));

	return output;
}

const start = async () => {
	// Get script.
	const apiInfo = await apiInformation();
	const verInfo = versionInformation(apiInfo);
	const umbraVersion = await chooseVersion(apiInfo, verInfo);
	let script = await getScript(umbraVersion);
	script = parseScript(script);

	// Tag script.
	let tags = getTags(script);
	script = await loadTagLinks(script, tags);
	script = tagLines(script, tags);
	tags = measureTags(script, tags);

	// Export compiled script.
	const compileSettings = await chooseCompileSettings(tags);
	script = compileScript(script, compileSettings.usedTagNames, compileSettings.doUglify);
	fs.writeFile(LOCAL_FILE_NAME, script, (err) => {
		if (err) { logError(`Failed to write output to file "${LOCAL_FILE_NAME}".`, err); }
	});
};
start();
