
const { getUniqueID, logger } = require('./utils');
const db = require('./firebase/chat');
const wsServer = require('./server');

// Clients storage and handling
const clients = {};
const sendToClients = (data, room) => Object.values(clients).filter(client => client.room === room).forEach(client => client.sendUTF(data));
const sendUsersList = (room) => {
  const roomUsers = Object.values(clients).filter(client => client.room === room);
  sendToClients(JSON.stringify({ type: 'users', users: roomUsers.reduce((acc, { userName }) => ([...acc, userName]), []) }), room);
};

// websocket server
wsServer.on('request', function (request) {
  const userID = getUniqueID();
  logger('Recieved a new connection from ' + request.origin + '.');

  // Set new client
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  try {

    clients[userID].sendUTF(JSON.stringify({ type: 'setUserId', userId: userID }));
    logger('New user connected: ' + userID);
  } catch (error) {
    logger('Error: ' + error);
  }

  connection.on('message', function (message) {
    const dataFromClient = JSON.parse(message.utf8Data);
    switch (dataFromClient.type) {

    case 'login':
      const usersName = Object.values(clients).map(({ userName }) => userName);
      const exist = !!usersName.find(user => user === dataFromClient.userName);
      if (exist) {
        clients[userID].sendUTF(JSON.stringify({ type: 'login', success: false }));
        return;
      }
      clients[userID].userName = dataFromClient.userName;
      clients[userID].room = dataFromClient.room;
      clients[userID].sendUTF(JSON.stringify({ type: 'login', success: true }));
      logger(`User ${dataFromClient.userName} (${userID}) joined room ${dataFromClient.room}`);
      sendUsersList(dataFromClient.room);
      break;

    case 'message':
      const timestamp = new Date();
      const messageData = { ...JSON.parse(message.utf8Data), timestamp };
      sendToClients(JSON.stringify(messageData), dataFromClient.room);
      db.setMessage(dataFromClient.room, messageData);
      logger('Message sent to room ' + dataFromClient.room);
      break;

    case 'typing':
      sendToClients(message.utf8Data, dataFromClient.room);
      break;

    case 'history':
      db.getMessages(dataFromClient.room).then(messages => {
        const userID = dataFromClient.userId;
        clients[userID].sendUTF(JSON.stringify({ type: 'history', messages }));
      }
      );
      break;
    }
  });

  // user disconnected
  connection.on('close', function (connection) {
    logger('disconnected: ' + userID);
    const { room } = clients[userID];
    delete clients[userID];
    sendUsersList(room);
  });
});
