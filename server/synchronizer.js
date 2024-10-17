class Synchronizer {
	constructor(wss, tcpConnection) {
		this.wss = wss;
		this.tcpConnection = tcpConnection;
	}

	syncState(entityId, state) {
		const message = JSON.stringify({ entityId, state });
		this.wss.clients.forEach((client) => {
			client.send(JSON.stringify({ type: 'sync', entityId, state }));
		});
		this.tcpConnection.sendCommand(message);
	}
}

module.exports = Synchronizer;
