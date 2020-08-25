const electron = require('electron');

electron.app.whenReady().then(() => {
	const window = new electron.BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true } });
	window.loadFile('index.html');
});

app.on('window-all-closed', () => app.quit());
