const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Conectado ao RabbitMQ no serviço de notificação");

    // Assegura que as filas sejam declaradas
    await channel.assertQueue('paymentQueue', { durable: true });
    await channel.assertQueue('notificationQueue', { durable: true });

  } catch (error) {
    console.error("Erro ao conectar no RabbitMQ", error);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
