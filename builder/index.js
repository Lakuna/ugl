class Tag {
	constructor(name) {
		this.name = name;
		this.description = '';
		this.size = '';
		this.requires = [];
	}
}

class Line {
	constructor() {
		this.text = '';
		this.comment = '';
		this.tags = [];
	}
}

const electron = require('electron');
const request = require('request');

const API = 'https://lakuna.pw/api/umbra/umbra.json';
const app = electron.app;

app.whenReady().then(() => {
	// Show window.
	const window = new electron.BrowserWindow({ width: 800, height: 600, title: "Umbra Builder", show: false, webPreferences: { nodeIntegration: true } });
	window.loadFile('index.html');
	window.once('ready-to-show', () => window.show());

	// Get Umbra distribution.
	request(API, (err, res, body) => {
		const api = JSON.parse(body);
		const release = api.releases.find((release) => release.version == api.latest);

		request(release.url, (err, res, body) => {
			const allTags = [];
			const currentTags = [];
			let inMultilineComment = false;
			body.split(/[\r\n]+/).forEach((line) => {
				// Build Line object.
				const parsedLine = new Line();
				let inComment = false;
				line.split(/ +/).forEach((segment) => {
					segment = segment.trim();
					if (segment.startsWith('//')) { inComment = true; segment = segment.substring(2); }
					if (segment.startsWith('/*')) { inMultilineComment = true; segment = segment.substring(2); }
					if (segment.startsWith('*/')) { inMultilineComment = false; segment = segment.substring(2); }
					if (!(segment.length > 0)) { return; } // Skip empty lines.
					if (inComment || inMultilineComment) { parsedLine.comment += segment + ' '; } else { parsedLine.text += segment + ' '; }
				});
				parsedLine.text = parsedLine.text.trim();
				parsedLine.comment = parsedLine.comment.trim();

				// Assign tags to line, or build tags from line.
				const comment = parsedLine.comment.split(/ +/);
				if (comment[0] == "UTAGDEF") {
					let tag = allTags.find((tag) => tag.name == comment[2]);
					if (!tag) {
						tag = new Tag(comment[2]);
						allTags.push(tag);
						console.log(`New tag: ${tag.name}.`);
					}

					const commentBody = comment.slice(3).join(' ');

					// Assign tag meta.
					if (comment[1] == "DESC") {
						tag.description = commentBody;
					} else if (comment[1] == "SIZE") {
						tag.size = commentBody;
					} else if (comment[1] == "REQU") {
						tag.requires.push(allTags.find((tag) => tag.name == commentBody));
					}
				}
			});
		});
	});
});

app.on('window-all-closed', () => app.quit());
