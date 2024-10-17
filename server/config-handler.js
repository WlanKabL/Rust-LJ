const fs = require('fs');

class ConfigHandler {
	constructor(configPath) {
		this.configPath = configPath;
		this.configData = this.loadConfig();
	}

	loadConfig() {
		try {
			const configData = fs.readFileSync(this.configPath, 'utf8');
			return JSON.parse(configData);
		} catch (err) {
			console.error('Error loading config:', err);
			return { smartSwitches: [] };
		}
	}

	saveConfig() {
		try {
			fs.writeFileSync(
				this.configPath,
				JSON.stringify(this.configData, null, 2)
			);
			console.log('Config file updated successfully.');
		} catch (err) {
			console.error('Error saving config:', err);
		}
	}

	updateSwitch(switchId, entityId, state) {
		const switchIndex = this.configData.smartSwitches.findIndex(
			(s) => s.id === switchId
		);
		if (switchIndex !== -1) {
			this.configData.smartSwitches[switchIndex].entityId =
				entityId || ''; // Nur dann setzen, wenn `entityId` vorhanden ist
			this.configData.smartSwitches[switchIndex].entityInitialStage =
				state || false;
			console.log(
				`Updated switch ${switchId} with entityId ${entityId} and state ${state}.`
			);
			this.saveConfig();
		} else {
			console.warn(
				`Switch with id ${switchId} not found. No update performed.`
			);
		}
	}

	getSmartSwitches() {
		return this.configData.smartSwitches;
	}
}

module.exports = ConfigHandler;
