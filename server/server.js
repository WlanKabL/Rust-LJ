// server.js
const path = require('path');
const fs = require('fs');
const TcpConnection = require('./tcp-connection');
const WebSocketServer = require('./websocket');
const ConfigHandler = require('./config-handler');
const SwitchManager = require('./switch-manager');

const configPath = path.join(__dirname, '../config.json');
const configHandler = new ConfigHandler(configPath);
const smartSwitches = configHandler.getSmartSwitches();
const tcpConnection = new TcpConnection(13377, '85.215.152.210');
const wsServer = new WebSocketServer(8080);
const switchManager = new SwitchManager(
	wsServer,
	tcpConnection,
	smartSwitches,
	configHandler
);

tcpConnection.connect();
wsServer.start();
