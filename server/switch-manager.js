class SwitchManager {
	constructor(wsServer, tcpConnection, smartSwitches, configHandler) {
		this.wsServer = wsServer;
		this.tcpConnection = tcpConnection;
		this.smartSwitches = smartSwitches;
		this.configHandler = configHandler;
		this.currentSwitchIndex = 0;
		this.filteredSwitches = [];

		this.initWebSocket();
		this.initTcpConnection();
	}

	initWebSocket() {
		this.wsServer.on('clientConnected', () => {
			this.wsServer.sendMessage(
				JSON.stringify({
					type: 'smartSwitchList',
					switches: this.smartSwitches,
				})
			);
		});

		this.wsServer.on('message', (messageBuffer) => {
			const message = JSON.parse(messageBuffer.toString());
			switch (message.type) {
				case 'start-config':
					this.startConfig(message.group);
					break;
				case 'next':
					this.nextSwitch();
					break;
				case 'prev':
					this.prevSwitch();
					break;
				default:
					this.tcpConnection.sendMessage(messageBuffer.toString());
			}
		});
	}

	initTcpConnection() {
		this.tcpConnection.on('message', (data) => {
			const message = data.toString();
			console.log('Received from TCP:', message);

			// Assuming message format is JSON
			try {
				const { EntityId, State } = JSON.parse(message);
				const switchId =
					this.filteredSwitches[this.currentSwitchIndex]?.id;
				if (switchId) {
					this.wsServer.sendMessage(
						JSON.stringify({
							type: 'entity-update',
							entityId: EntityId,
							state: State,
						})
					);
					this.configHandler.updateSwitch(switchId, EntityId, State);
					this.wsServer.sendMessage(
						JSON.stringify({
							type: 'success',
						})
					);
					this.nextSwitch();
				}
			} catch (error) {
				console.error('Error parsing TCP message:', error.message);
			}
		});
	}

	startConfig(group) {
		this.filteredSwitches = this.smartSwitches.filter((switchConfig) =>
			switchConfig.id.startsWith(group)
		);
		this.currentSwitchIndex = 0;
		if (this.filteredSwitches.length > 0) {
			this.sendCurrentSwitch();
		} else {
			this.wsServer.sendMessage(
				JSON.stringify({
					type: 'error',
					message: 'No switches found for the selected group.',
				})
			);
		}
	}

	nextSwitch() {
		if (this.currentSwitchIndex < this.filteredSwitches.length - 1) {
			this.currentSwitchIndex++;
			this.sendCurrentSwitch();
		} else {
			this.wsServer.sendMessage(
				JSON.stringify({ type: 'config-complete' })
			);
		}
	}

	prevSwitch() {
		if (this.currentSwitchIndex > 0) {
			this.currentSwitchIndex--;
			this.sendCurrentSwitch();
		}
	}

	sendCurrentSwitch() {
		const switchConfig = this.filteredSwitches[this.currentSwitchIndex];
		this.wsServer.sendMessage(
			JSON.stringify({ type: 'configure-switch', switch: switchConfig })
		);
	}
}

module.exports = SwitchManager;
