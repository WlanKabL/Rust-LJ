const WebSocket = require('ws');

class WebSocketServer {
	constructor(port) {
		this.port = port;
		this.wss = new WebSocket.Server({ port });
		console.log(
			`WebSocket server is listening on ws://localhost:${this.port}`
		);
	}

	start() {
		this.wss.on('connection', (ws) => {
			this.client = ws;
			if (this.onClientConnected) this.onClientConnected();

			ws.on('message', (message) => {
				if (this.onMessage) this.onMessage(message);
			});
		});
	}

	on(event, callback) {
		if (event === 'clientConnected') {
			this.onClientConnected = callback;
		} else if (event === 'message') {
			this.onMessage = callback;
		}
	}

	sendMessage(message) {
		if (this.client && this.client.readyState === WebSocket.OPEN) {
			this.client.send(message);
		}
	}
}

module.exports = WebSocketServer;
