const net = require('net');

class TcpConnection {
	constructor(port, host) {
		this.port = port;
		this.host = host;
		this.client = new net.Socket();
	}

	connect() {
		this.client.connect(this.port, this.host, () => {
			console.log(`Connected to TCP server at ${this.host}:${this.port}`);
		});

		this.client.on('data', (data) => {
			if (this.onMessage) this.onMessage(data.toString());
		});
	}

	on(event, callback) {
		if (event === 'message') {
			this.onMessage = callback;
		}
	}

	sendMessage(message) {
		this.client.write(message);
	}
}

module.exports = TcpConnection;
