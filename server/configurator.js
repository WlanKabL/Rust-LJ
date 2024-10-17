const fs = require('fs');
const path = './config.json';

class Configurator {
	loadConfig() {
		if (fs.existsSync(path)) {
			const configData = fs.readFileSync(path);
			return JSON.parse(configData);
		}
		console.error('Config file not found');
		return {};
	}
}

module.exports = Configurator;
