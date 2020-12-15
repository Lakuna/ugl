const uglify = require('./uglify'); // uglify-es: uglifyjs --self --wrap exports > uglify.js
const beautify = require('js-beautify');

// Credit: Simon Willison.
addLoadEvent = (event) => {
	const old = onload;
	if (typeof old != 'function') {
		onload = event;
	} else {
		onload = () => {
			old();
			event();
		}
	}
}

addLoadEvent((event) => {
	class Tag {
		constructor(name, script) {
			this.name = name;
			this.script = script;
			this.description = '';
			this.size = 0;
			this.requiredTagNames = [];
			this.link = '';
		}

		dependencies(includeSelf = true, tag = this, output = []) {
			let toAdd = [tag];

			const requiredTag = tag.script.tags.find((tag) => tag.name == 'REQUIRED');
			if (requiredTag) {
				toAdd.push(requiredTag);
			} else {
				console.warn(`Unable to find the REQUIRED tag.`);
			}

			while (toAdd.length > 0) {
				const addingTag = toAdd.shift();
				if (output.includes(addingTag)) { continue; }
				output.push(addingTag);

				for (const requiredTagName of addingTag.requiredTagNames) {
					const requiredTag = tag.script.tags.find((tag) => tag.name == requiredTagName);
					if (!requiredTag) {
						console.warn(`Error getting required tag "${requiredTagName}" for tag "${addingTag}".`);
						continue;
					}
					output = this.dependencies(true, requiredTag, output);
				}
			}

			if (!includeSelf) { output = output.filter((outputTag) => outputTag != tag); }

			return output;
		}

		toString() {
			return this.name;
		}
	}

	class Line {
		constructor(code = '', comment = '') {
			this.code = code;
			this.comment = comment;
			this.tagNames = [];
		}
	}

	class Script {
		constructor(script) {
			this.lines = [];
			this.tags = [];

			let inMultilineComment = false;
			for (let line of script.split(/[\r\n]+/)) {
				line = line.trim();
				let code = '';
				let comment = '';

				let inComment = false;
				for (let word of line.split(/ +/)) {
					word = word.trim();

					if (word.startsWith('//')) {
						inComment = true;
						word = word.substring('//'.length);
					} else if (word.startsWith('/*')) {
						inMultilineComment = true;
						word = word.substring('/*'.length);
					} else if (word.startsWith('*/')) {
						inMultilineComment = false;
						word = word.substring('*/'.length)
					}

					if (word.length <= 0) { continue; }

					if (inComment || inMultilineComment) { comment += `${word} `; } else { code += `${word} `; }
				}

				this.lines.push(new Line(code, comment));
			}
		};

		getTags() {
			for (const line of this.lines) {
				const comment = line.comment.split(/ +/);
				const operator = comment[0];
				const property = comment[1];
				const tagName = comment[2];
				const data = comment.slice(3).join(' ').trim();

				if (operator != 'UTAGDEF') { continue; }

				// Find or create tag.
				let tag = this.tags.find((tag) => tag.name == tagName);
				if (!tag) {
					tag = new Tag(tagName, this);
					this.tags.push(tag);
				}
				
				switch (property) {
					case 'DESC':
						tag.description = data;
						break;
					case 'REQU':
						const requiredTag = this.tags.find((tag) => tag.name == data);
						if (!requiredTag) {
							console.warn(`${tag} is unable to require tag "${data}".`);
							continue;
						}
						tag.requiredTagNames.push(requiredTag.name);
						break;
					case 'LINK':
						tag.link = data;
						break;
					case 'SIZE':
						console.log(`Skipping deprecated property "${property}".`);
						break;
					default:
						console.warn(`Skipping unknown property "${property}".`);
						break;
				}
			}

			return this;
		}

		loadExternal() {
			return new Promise((resolve, reject) => {
				let tagsLoaded = 0;
				for (const tag of this.tags) {
					if (!tag.link) {
						tagsLoaded++;
						if (tagsLoaded >= this.tags.length) { resolve(this); }
						continue;
					}

					get(tag.link)
							.then((script) => {
								script = new Script(script);
								this.lines.push(new Line('', `UTAGSET START ${tag.name}`));
								this.lines = this.lines.concat(script.lines);
								this.lines.push(new Line('', `UTAGSET END ${tag.name}`));
							})
							.catch((err) => console.error(`Error getting script linked by tag "${tag}" from URL ${tag.link}: ${err}`))
							.finally(() => {
								tagsLoaded++;
								if (tagsLoaded >= this.tags.length) { resolve(this); }
							});
				}
			});
		}

		tagLines() {
			let inMultilineTagNames = [];
			for (let line of this.lines) {
				let inTagNames = [];

				const comment = line.comment.split(/ +/);
				const operator = comment[0];
				const property = comment[1];
				const tagName = comment[2];

				if (operator == 'UTAGSET') {
					let tag = this.tags.find((tag) => tag.name == tagName);
					if (!tag) {
						console.error(`Failed to set line tag "${tagName}".`);
						continue;
					}

					switch (property) {
						case 'START':
							inMultilineTagNames.push(tag.name);
							break;
						case 'END':
							inMultilineTagNames = inMultilineTagNames.filter((tagName) => tagName != tag.name);
							inTagNames.push(tag.name);
							break;
						case 'LINE':
							inTagNames.push(tag.name);
							break;
						default:
							console.warn(`Skipping unknown property "${property}".`);
							break;
					}
				}

				for (const lineTagName of inTagNames.concat(inMultilineTagNames)) {
					line.tagNames.push(lineTagName);
				}
			}

			return this;
		}

		compile(includedTagNames = [], uglified = true, beautified = false) {
			let output = '';

			for (const line of this.lines) {
				if (!line.tagNames.some((tagName) => includedTagNames.includes(tagName))) { continue; }
				output += `${line.code}${!uglified && line.comment ? `${line.code ? ' ' : ''}// ${line.comment}` : ''}\n`;
			}

			if (uglified) {
				const uglified = uglify.minify(output);
				if (uglified.error) {
					console.error(`Failed to uglify script: ${uglified.error}`);
				} else {
					output = uglified.code;
				}
			}

			if (beautified) {
				output = beautify.js(output, { "indent-with-tabs": true });
			}

			return output;
		}

		measureTags() {
			for (const tag of this.tags) {
				let inclusiveTagNames = [];
				for (const dependencyTag of tag.dependencies()) { inclusiveTagNames.push(dependencyTag.name); }
				const inclusiveLength = this.compile(inclusiveTagNames).length;

				let exclusiveTagNames = [];
				for (const dependencyTag of tag.dependencies(false)) { exclusiveTagNames.push(dependencyTag.name); }
				const exclusiveLength = this.compile(exclusiveTagNames).length;

				tag.size = inclusiveLength - exclusiveLength;
			}

			return this;
		}
	}

	const builder = document.getElementById('builder');

	get('/api/api.json')
			.then((res) => {
				res = JSON.parse(res);

				// Make version selection UI.
				const versionSelector = document.createElement('div');
				const versionSelectorCaption = document.createElement('p');
				versionSelectorCaption.innerHTML = 'Select a version:';
				versionSelector.append(versionSelectorCaption);
				for (const version of res.versions) {
					const versionSelectButton = document.createElement('button');
					versionSelectButton.innerHTML = version.version;
					versionSelectButton.onclick = () => {
						versionSelector.remove(); // Only allow user to select one version to avoid cluttering the UI.
						return build(version);
					};
					versionSelector.append(versionSelectButton);
				}
				builder.append(versionSelector);
			})
			.catch((err) => console.error(err));

	const build = (version) => {
		get(version.source)
				.then((res) => new Script(res).getTags().loadExternal())
				.then((script) => {
					script.tagLines().measureTags();

					// Make tag table.
					const tagTable = document.createElement('table');
					const tagBoxes = {};

					const headerRow = document.createElement('tr');
					const nameHeader = document.createElement('th');
					nameHeader.innerHTML = 'Name';
					headerRow.append(nameHeader);
					const includeHeader = document.createElement('th');
					includeHeader.innerHTML = 'Include';
					headerRow.append(includeHeader);
					const descriptionHeader = document.createElement('th');
					descriptionHeader.innerHTML = 'Description';
					headerRow.append(descriptionHeader);
					const sizeHeader = document.createElement('th');
					sizeHeader.innerHTML = 'Size';
					headerRow.append(sizeHeader);
					tagTable.append(headerRow);

					for (const tag of script.tags) {
						const tagRow = document.createElement('tr');
						const nameData = document.createElement('td');
						nameData.innerHTML = tag.name;
						tagRow.append(nameData);
						const includeData = document.createElement('td');
						const includeBox = document.createElement('input');
						includeBox.type = 'checkbox';
						includeData.append(includeBox);
						tagRow.append(includeData);
						tagBoxes[tag.name] = includeBox;
						const descriptionData = document.createElement('td');
						descriptionData.innerHTML = tag.description;
						tagRow.append(descriptionData);
						const sizeData = document.createElement('td');
						sizeData.innerHTML = `${tag.size} bytes`;
						tagRow.append(sizeData);
						tagTable.append(tagRow);
					}

					builder.append(tagTable);

					// Make post-processing form.
					const postProcessingForm = document.createElement('form');

					const postProcessingFormHeader = document.createElement('h2');
					postProcessingFormHeader.innerHTML = 'Post-processing Options';
					postProcessingForm.append(postProcessingFormHeader);

					const uglifyParagraph = document.createElement('p');
					const uglifyBox = document.createElement('input');
					uglifyBox.type = 'checkbox';
					uglifyBox.id = 'UGLIFY_CHECKBOX';
					uglifyBox.name = 'UGLIFY_CHECKBOX';
					uglifyParagraph.append(uglifyBox);
					const uglifyLabel = document.createElement('label');
					uglifyLabel.htmlFor = 'UGLIFY_CHECKBOX';
					uglifyLabel.innerHTML = 'Uglify';
					uglifyParagraph.append(uglifyLabel);
					postProcessingForm.append(uglifyParagraph);

					const beautifyParagraph = document.createElement('p');
					const beautifyBox = document.createElement('input');
					beautifyBox.type = 'checkbox';
					beautifyBox.id = 'BEAUTIFY_CHECKBOX';
					beautifyBox.name = 'BEAUTIFY_CHECKBOX';
					beautifyParagraph.append(beautifyBox);
					const beautifyLabel = document.createElement('label');
					beautifyLabel.htmlFor = 'BEAUTIFY_CHECKBOX';
					beautifyLabel.innerHTML = 'Beautify';
					beautifyParagraph.append(beautifyLabel);
					postProcessingForm.append(beautifyParagraph);

					builder.append(postProcessingForm);

					// Make compile buttons.
					const compileScriptButton = document.createElement('button');
					compileScriptButton.innerHTML = 'Compile Script';
					compileScriptButton.onclick = () => {
						// Get included tags from checked boxes.
						let includedTagNames = [];
						for (const tag of script.tags) {
							if (tagBoxes[tag.name].checked) {
								includedTagNames = tag.dependencies(true, tag, includedTagNames);
							}
						}
						includedTagNames = includedTagNames.map((tag) => tag.name);

						// Download script.
						download('umbra.js', script.compile(includedTagNames, uglifyBox.checked, beautifyBox.checked));
					};
					builder.append(compileScriptButton);

					/*
					const compileBoilerplateButton = document.createElement('button');
					compileBoilerplateButton.innerHTML = 'Coming Soon';
					compileBoilerplateButton.onclick = () => console.log('Not yet implemented.');
					builder.append(compileBoilerplateButton);
					*/
				})
				.catch((err) => console.error(err));
	}
});
