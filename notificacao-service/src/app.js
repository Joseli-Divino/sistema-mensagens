const express = require('express');
const { connectRabbitMQ } = require('./config/rabbitmq');
const { listenForMessages } = require('./controllers/notificationController');

const app = express();

const startServer = async () => {
  await connectRabbitMQ();
  listenForMessages(); // Inicia a escuta das mensagens na fila de pagamento
  app.listen(3001, () => {
    console.log('Servidor de notificação rodando na porta 3001');
  });
};

startServer();
