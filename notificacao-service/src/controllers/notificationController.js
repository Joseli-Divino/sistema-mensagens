const { getChannel } = require('../config/rabbitmq');

const listenForMessages = () => {
  const channel = getChannel();
  if (channel) {
    // Escuta a fila de pagamento (paymentQueue)
    channel.consume('paymentQueue', (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        console.log("Notificação recebida para solicitação:", messageContent);

        // Confirma que a mensagem foi processada
        channel.ack(msg);
      }
    });

    // Escuta a fila de confirmação (notificationQueue)
    channel.consume('notificationQueue', (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        console.log("Confirmação de transação recebida:", messageContent);

        // Aqui você pode adicionar a lógica para notificar o usuário sobre a confirmação
        channel.ack(msg);
      }
    });
  }
};

module.exports = { listenForMessages };
