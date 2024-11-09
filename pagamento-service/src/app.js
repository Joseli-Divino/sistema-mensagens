require('dotenv').config();

const express = require('express');
const { connectRabbitMQ } = require('./config/rabbitmq');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
app.use(express.json());

app.use('/api', paymentRoutes);

const startServer = async () => {
  await connectRabbitMQ();
  app.listen(3000, () => {
    console.log('Servidor de pagamento rodando na porta 3000');
  });
};

startServer();
