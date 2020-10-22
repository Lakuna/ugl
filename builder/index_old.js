const readline = require('readline');
const request = require('request');
const uglifyjs = require('uglify-es'); // Use ECMAScript version for support with newer features used in Umbra.
const fs = require('fs');
const columnify = require('columnify');

const API = 'https://lakuna.pw/api/umbra.json';
const REQUIRED_TAG_NAME = 'REQUIRED';
const LOCAL_VERSION_NAME = 'local';
const LOCAL_FILE_NAME = 'umbra.js';

// Get versions from API.
console.log('Checking API for versions...');
request(API, (err, res, body) => {
	if (err) { 
		// Offline mode.
		console.error(`Error accessing Umbra API. Using offline mode.\n${err}`);
		return chooseVersion({ latest: LOCAL_VERSION_NAME, recommended: LOCAL_VERSION_NAME, releases: [] });
	}

	// Online mode.
	return chooseVersion(JSON.parse(body));
});

const chooseVersion = (versions) => {
	// Make string to log to console.
	let info = `\nLatest version: ${versions.latest}\nAll versions: `;
	const versionMap = [];
	versions.releases.forEach((release) => {
		release.versions.forEach((version) => {
			const versionId = `${release.release}-${version.name}`;
			versionMap.push({ id: versionId, url: version.url });
			info += `${versionId}, `;
		});
	});

	// Add local option to build a distribution from a downloaded umbra.js file.
	localVersion = { id: LOCAL_VERSION_NAME, url: LOCAL_FILE_NAME };
	versionMap.push(localVersion);
	info += localVersion.id;

	// Print string.
	console.log(`${info}\nDefault: ${versions.recommended}`);

	// Make user select a version.
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	rl.question('Use version: ', (input) => {
		// Close the input source.
		rl.close();

		if (input.trim() == '') { input = versions.recommended; }

		// Get version information.
		const version = versionMap.find((version) => version.id == input);
		if (!version) { return console.error(`Unknown version "${input}".`); }

		if (version.id == localVersion.id) {
			// Use local version if selected.
			fs.readFile(localVersion.url, 'utf8', (err, data) => {
				if (err) { return console.error(`Error reading ${localVersion.url}.\n${err}`); }

				return parseVersion(data);
			});
		} else {
			// Use an online version.
			request(version.url, (err, res, body) => {
				if (err) { return console.error(`Error requesting ${version.url}.\n${err}`); }

				return parseVersion(body);
			});
		}
	});
}

const parseVersion = async (script) => {
	class Line {
		constructor() {
			this.tags = [];
			this.code = '';
			this.comment = '';
		}
	}
	class Tag {
		constructor(name) {
			this.name = name;
			this.description = '';
			this.size = '';
			this.requiresTags = [];
			this.requires = '';
		}
	}

	// Store all lines and tags in order.
	const tags = [];
	const lines = [];

	// Block details.
	let inMultilineComment = false;
	const inMultilineTags = [];

	// Build Tag and Line objects.
	for (let line of script.split(/[\r\n]+/)) {
		// Line details.
		let inComment = false;
		const inTags = [];

		// Remove indentations.
		line = line.trim();

		// Divide line string into parts to fill Line object.
		const parsedLine = new Line();
		line.split(/ +/).forEach((word) => {
			// Remove trailing whitespace.
			word = word.trim();

			// Check if word(s) are commented.
			if (word.startsWith('//')) { inComment = true; word = word.substring('//'.length); }
			if (word.startsWith('/*')) { inMultilineComment = true; word = word.substring('/*'.length); }
			if (word.startsWith('*/')) { inMultilineComment = false; word = word.substring('*/'.length); }

			// Ignore empty words.
			if (word.length <= 0) { return; }

			if (inMultilineComment || inComment) { parsedLine.comment += `${word} `; } else { parsedLine.code += `${word} `; }
		});

		// Remove trailing whitespace.
		parsedLine.code.trim();
		parsedLine.comment.trim();

		// Check line for tag definitions.
		const comment = parsedLine.comment.split(/ +/);
		const operator = comment[0];
		const tagName = comment[2];
		const propertyName = comment[1];
		const data = comment.slice(3).join(' ').trim();
		if (operator == 'UTAGDEF') {
			// Line defines a property of a tag.

			// Find or create the tag.
			let tag = tags.find((tag) => tag.name == tagName);
			if (!tag) { tag = new Tag(tagName); tags.push(tag); }

			// Assign the data to the designated property.
			if (propertyName == 'DESC') {
				// Assign tag description.
				tag.description = data;
			} else if (propertyName == 'REQU') {
				// Add a tag requirement.
				const requiredTag = tags.find((tag) => tag.name == data);
				if (!requiredTag) { return console.error(`Unable to require unknown tag "${data}".`); }

				tag.requiresTags.push(requiredTag);
			} else if (propertyName == 'SIZE') {
				console.log(`Ignoring outdated tag "${propertyName}".`);
			} else if (propertyName == 'LINK') {
				// TODO: Figure out why this is still acting async.

				// Include code from URL.
				console.log('1'); // TODO: Delete.
				await request(data, (err, res, body) => {
					console.log('2'); // TODO: Delete.
					if (err) { return console.error(`Error getting link ${data} for tag "${tag.name}".\n${err}`); }
					console.log('3'); // TODO: Delete.

					// Uglify linked code.
					let linkedCode = body;
					console.log('4'); // TODO: Delete.
					const uglified = uglifyjs.minify(linkedCode);
					console.log('5'); // TODO: Delete.
					if (uglified.error) { console.error(`Error uglifying code. Linking expanded code.\n${uglified.error}`); } else { linkedCode = uglified.code; }
					console.log('6'); // TODO: Delete.

					// Add linked code to file as lines.
					console.log('7'); // TODO: Delete.
					const linkLine = new Line();
					linkLine.comment = `Linked from ${data}.`;
					linkLine.code = linkedCode;
					linkLine.tags.push(tag);
					lines.push(linkLine);
					console.log('8'); // TODO: Delete.
				});
				console.log('9'); // TODO: Delete.
			} else { return console.error(`Unknown tag property "${propertyName}".`); }
		}

		// Check line for tag designations.
		else if (operator == 'UTAGSET') {
			// Find the tag.
			let tag = tags.find((tag) => tag.name == tagName);
			if (!tag) { return console.error(`Unknown tag "${tagName}".`); }

			// Assign tag to lines based on designation.
			if (propertyName == 'START') {
				// Subsequent lines belong to this tag.
				inMultilineTags.push(tag);
			} else if (propertyName == 'END') {
				// Subsequent lines no longer belong to this tag.
				inMultilineTags.splice(inMultilineTags.indexOf(tag), 1);
				inTags.push(tag); // Still use ended tag on current line.
			} else if (propertyName == 'LINE') {
				// This line belongs to this tag.
				inTags.push(tag);
			} else { return console.error(`Unknown group designation "${propertyName}".`); }
		}

		// Add tags to Line object.
		inMultilineTags.forEach((tag) => parsedLine.tags.push(tag));
		inTags.forEach((tag) => parsedLine.tags.push(tag));

		// Add Line object to list of lines.
		lines.push(parsedLine);
	}

	// Calculate size of each tag.
	const requiredTag = tags.find((tag) => tag.name.toLowerCase() == REQUIRED_TAG_NAME.toLowerCase());
	tags.forEach((tag) => tag.size = getTagSize(lines, tag, requiredTag));

	// Make printable version of each Tag object's requirements.
	for (let i = 0; i < tags.length; i++) {
		const tag = tags[i];

		// Build string of requirements.
		let requires = '[';
		tag.requiresTags.forEach((tag) => requires += `${tag.name}, `);
		requires = `${requires.substring(0, requires.length - ', '.length)}]`; // Make end of string pretty.
		if (requires == ']') { requires = ''; } // Make string empty if no tags are required.

		// Add text to Tag object.
		tag.requires = requires;
	}

	return chooseTags(lines, tags);
}

const getTagSize = (lines, tag, requiredTag) => {
	// Get size of requirements with tag.
	let script = '';
	let tags = [];
	[...tag.requiresTags].concat([tag, requiredTag]).forEach((inclusiveTag) => fillTagsRecursively(inclusiveTag, tags));
	lines.forEach((line) => {
		if (line.tags.some((lineTag) => tags.includes(lineTag))) { script += `${line.code}\n`; }
	});
	let uglified = uglifyjs.minify(script);
	if (uglified.error) { console.error(`Error uglifying code (inclusive). Measuring tag "${tag.name}" size using expanded code.\n${uglified.error}`); } else { script = uglified.code; }
	let size = script.length;

	// Subtract size of requirements without tag.
	if (tag != requiredTag) {
		script = '';
		tags = [];
		[...tag.requiresTags].concat([requiredTag]).forEach((exclusiveTag) => fillTagsRecursively(exclusiveTag, tags));
		lines.forEach((line) => {
			if (line.tags.some((lineTag) => tags.includes(lineTag))) { script += `${line.code}\n`; }
		});
		uglified = uglifyjs.minify(script);
		if (uglified.error) { console.error(`Error uglifying code (inclusive). Measuring tag "${tag.name}" size using expanded code.\n${uglified.error}`); } else { script = uglified.code; }
		size -= script.length;
	}

	return size + 'B';
}

// Add tag requirements recursively.
const fillTagsRecursively = (tag, array) => {
	array.push(tag);
	tag.requiresTags.forEach((tag) => {
		if (array.includes(tag)) { return; }
		fillTagsRecursively(tag, array);
	});
}

const chooseTags = (lines, tags) => {
	console.log(
			'\n' +
			`${columnify(tags, { columns: ['name', 'description', 'size', 'requires'] })}\n` +
			`The ${REQUIRED_TAG_NAME} tag is automatically included. Tag dependencies are automatically included.\n` +
			'Use an asterisk ("*") to include every tag.\n' +
			'Use an exclamation point ("!") to include comments.'
	);

	// Choose included tags from user input.
	let usedTags = [];

	// Add REQUIRED tag.
	const requiredTag = tags.find((tag) => tag.name.toLowerCase() == REQUIRED_TAG_NAME.toLowerCase());
	if (!requiredTag) { return console.error(`The ${REQUIRED_TAG_NAME} tag is missing.`); }
	fillTagsRecursively(requiredTag, usedTags);

	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	rl.question('Included tags (space-separated): ', (input) => {
		// Close the input source.
		rl.close();

		// Get a list of tag names as defined by the user.
		const tagNames = input.split(/ +/);

		// Whether to include comments in the output.
		let includeComments = false;

		// Find tags by name.
		tagNames.forEach((tagName) => {
			if (tagName.trim() == '') {
				return;
			} else if (tagName == '*') {
				usedTags = [...tags]; // Use all tags.
			} else if (tagName == '!') {
				includeComments = true;
			} else {
				const tag = tags.find((tag) => tag.name.toLowerCase() == tagName.toLowerCase());
				if (!tag) { return console.error(`Unknown tag "${tagName}".`); }
				fillTagsRecursively(tag, usedTags);
			}
		});

		return buildFile(lines, usedTags, includeComments);
	});
}

const buildFile = (lines, tags, includeComments) => {
	let output = '';

	// Add lines that use at least one tag defined by the user.
	lines.forEach((line) => {
		if (line.tags.some((tag) => tags.includes(tag))) {
			output += line.code;
			if (includeComments && line.comment.length > 0) {
				if (line.code.length > 0) { output += ' '; }
				output += `// ${line.comment}`;
			}
			output += '\n';
		}
	});

	// Uglify output.
	if (!includeComments) {
		const uglified = uglifyjs.minify(output);
		if (uglified.error) { console.error(`Error uglifying code. Outputting expanded code.\n${uglified.error}`); } else { output = uglified.code; }
	}

	// Save to file.
	fs.writeFile(LOCAL_FILE_NAME, output, (err) => {
		if (err) { return console.error(`Error while writing output file:\n${err}.`); }
	});

	return true; // Success.
}