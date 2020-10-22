const readline = require('readline');
const request = require('request');
const uglifyjs = require('uglify-es'); // Use ECMAScript version for support with newer features used in Umbra.
const fs = require('fs');
const columnify = require('columnify');

const API = 'https://lakuna.pw/api/umbra.json';

request(API, (err, res, body) => {
	if (err) { 
		console.error(`Error accessing Umbra API: ${err}.\nUsing offline mode.`);

		// Offline mode.
		return chooseVersion({ latest: 'local', recommended: 'local', releases: [] });
	}

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
	localVersion = { id: 'local', url: 'umbra.js' };
	versionMap.push(localVersion);
	info += localVersion.id;

	// Print string.
	console.log(`${info}\nDefault: ${versions.recommended}`);

	// Make user select a version.
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	rl.question('Use version: ', (input) => {
		// Close the input source.
		rl.close();

		if (input.trim() == '') { input = versions.recommended}

		// Get version information.
		const version = versionMap.find((version) => version.id == input);
		if (!version) { return console.error(`Unknown version "${input}".`); }

		if (version.id == localVersion.id) {
			// Use local version if selected.
			fs.readFile(localVersion.url, 'utf8', (err, data) => {
				if (err) { return console.error(`Error reading ${localVersion.url}: ${err}`); }

				return parseVersion(data);
			});
		} else {
			// Use an online version.
			request(version.url, (err, res, body) => {
				if (err) { return console.error(err); }

				return parseVersion(body);
			});
		}
	});
}

const parseVersion = (script) => {
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
	script.split(/[\r\n]+/).forEach((line) => {
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
		if (comment[0] == 'UTAGDEF') {
			// Line defines a property of a tag.

			// Find or create the tag.
			let tag = tags.find((tag) => tag.name == comment[2]);
			if (!tag) { tag = new Tag(comment[2]); tags.push(tag); }

			// Get the data in the definition.
			const data = comment.slice(3).join(' ').trim();

			// Assign the data to the designated property.
			if (comment[1] == 'DESC') {
				// Assign tag description.
				tag.description = data;
			} else if (comment[1] == 'REQU') {
				// Add a tag requirement.
				const requiredTag = tags.find((tag) => tag.name == data);
				if (!requiredTag) { return console.error(`Unable to require tag "${data}".`); }

				tag.requiresTags.push(requiredTag);
			} else { return console.error(`Unknown tag property "${comment[1]}".`); }
		}

		// Check line for tag designations.
		else if (comment[0] == 'UTAGSET') {
			// Find the tag.
			let tag = tags.find((tag) => tag.name == comment[2]);
			if (!tag) { return console.error(`Unknown tag "${comment[2]}".`); }

			// Assign tag to lines based on designation.
			if (comment[1] == 'START') {
				// Subsequent lines belong to this tag.
				inMultilineTags.push(tag);
			} else if (comment[1] == 'END') {
				// Subsequent lines no longer belong to this tag.
				inMultilineTags.splice(inMultilineTags.indexOf(tag), 1);
				inTags.push(tag); // Still use ended tag on current line.
			} else if (comment[1] == 'LINE') {
				// This line belongs to this tag.
				inTags.push(tag);
			} else { return console.error(`Unknown group designation "${comment[1]}".`); }
		}

		// Add tags to Line object.
		inMultilineTags.forEach((tag) => parsedLine.tags.push(tag));
		inTags.forEach((tag) => parsedLine.tags.push(tag));

		// Add Line object to list of lines.
		lines.push(parsedLine);
	});

	tags.forEach((tag) => tag.size = getTagSize(lines, tag));

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

const getTagSize = (lines, tag) => {
	let script = '';
	let tags = [...tag.requiresTags]; // Clone the array instead of referencing it to avoid adding the tag as its own requirement.
	tags.push(tag);
	lines.forEach((line) => {
		if (line.tags.some((lineTag) => tags.includes(lineTag))) { script += `${line.code}\n`; }
	});
	let uglified = uglifyjs.minify(script);
	if (uglified.error) { return console.error(`Error uglifying code: ${uglified.error}.\nMeasuring tag size using expanded code.`); } else { script = uglified.code; }
	size = script.length;

	// Get size of requirements without tag.
	script = '';
	tags = [...tag.requiresTags];
	lines.forEach((line) => {
		if (line.tags.some((lineTag) => tags.includes(lineTag))) { script += `${line.code}\n`; }
	});
	uglified = uglifyjs.minify(script);
	if (uglified.error) { return console.error(`Error uglifying code: ${uglified.error}.\nMeasuring tag size using expanded code.`); } else { script = uglified.code; }
	size -= script.length;

	return size + 'b';
}

const chooseTags = (lines, tags) => {
	console.log(`\n${columnify(tags, { columns: ['name', 'description', 'size', 'requires'] })}\nThe REQUIRED tag is automatically included. Tag dependencies are automatically included.\nUse an asterisk to include every tag.`);

	// Choose included tags from user input.
	let usedTags = [];

	// Add tag requirements recursively.
	const addRequiredTag = (tag, array) => {
		array.push(tag);
		tag.requiresTags.forEach((tag) => {
			if (array.includes(tag)) { return; }
			addRequiredTag(tag, array);
		});
	}

	// Add REQUIRED tag.
	const requiredTag = tags.find((tag) => tag.name.toLowerCase() == 'REQUIRED'.toLowerCase());
	if (!requiredTag) { return console.error('The REQUIRED tag is missing.'); }
	addRequiredTag(requiredTag, usedTags);

	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	rl.question('Included tags (space-separated): ', (input) => {
		// Close the input source.
		rl.close();

		// Get a list of tag names as defined by the user.
		const tagNames = input.split(/ +/);

		// Find tags by name.
		tagNames.forEach((tagName) => {
			if (tagName.trim() == '') {
				return;
			} else if (tagName == '*') {
				usedTags = [...tags]; // Use all tags.
			} else {
				const tag = tags.find((tag) => tag.name.toLowerCase() == tagName.toLowerCase());
				if (!tag) { return console.log(`Unknown tag "${tagName}".`); }
				addRequiredTag(tag, usedTags);
			}
		});

		return buildFile(lines, usedTags);
	});
}

const buildFile = (lines, tags) => {
	let output = '';

	// Add lines that use at least one tag defined by the user.
	lines.forEach((line) => {
		if (line.tags.some((tag) => tags.includes(tag))) { output += `${line.code}\n`; }
	});

	// Uglify output.
	const uglified = uglifyjs.minify(output);
	if (uglified.error) { return console.error(`Error uglifying code: ${uglified.error}.\nOutputting expanded code.`); } else { output = uglified.code; }

	fs.writeFile('umbra.js', output, (err) => {
		if (err) { return console.error(`Error while writing output file: ${err}.`); }
	});

	return true; // Success.
}
