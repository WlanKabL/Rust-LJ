class Initializer {
	constructor(configurator, wss) {
		this.configurator = configurator;
		this.switches = this.configurator.loadConfig().smartSwitches;
		this.currentIndex = 0;
		this.wss = wss;
	}

	startSetup() {
		this.broadcastSwitch();
	}

	next() {
		this.currentIndex = (this.currentIndex + 1) % this.switches.length;
		this.broadcastSwitch();
	}

	prev() {
		this.currentIndex =
			(this.currentIndex - 1 + this.switches.length) %
			this.switches.length;
		this.broadcastSwitch();
	}

	selectGroup(group) {
		if (group === 'all') {
			this.switches.forEach((sw, index) => {
				this.currentIndex = index;
				this.broadcastSwitch();
			});
		} else {
			const groupSwitches = this.switches.filter((sw) =>
				sw.id.startsWith(group)
			);
			if (groupSwitches.length > 0) {
				this.currentIndex = this.switches.indexOf(groupSwitches[0]);
				this.broadcastSwitch();
			}
		}
	}

	broadcastSwitch() {
		const currentSwitch = this.switches[this.currentIndex];
		this.wss.clients.forEach((client) => {
			client.send(
				JSON.stringify({ type: 'setup', name: currentSwitch.id })
			);
		});
	}
}

module.exports = Initializer;
