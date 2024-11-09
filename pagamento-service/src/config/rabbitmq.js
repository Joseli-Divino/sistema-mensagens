const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Conectado ao RabbitMQ");
  } catch (error) {
    console.error("Erro ao conectar no RabbitMQ", error);
    // Tenta reconectar após 5 segundos
    setTimeout(connectRabbitMQ, 5000);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
