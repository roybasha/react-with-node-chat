
const http = require('http');
const webSocketServer = require('websocket').server;
const { logger } = require('./utils');

// Server setup
const port = process.env.PORT || 8000;
const server = http.createServer();
server.listen(port);

const wsServer = new webSocketServer({ httpServer: server });
logger(`listening on port ${port}`);

module.exports = wsServer;
