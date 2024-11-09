const pool = require('../config/database');
const { getChannel } = require('../config/rabbitmq');

const confirmTransaction = async (transactionId) => {
  console.log('Iniciando a atualização de status para a transação:', transactionId);
  
  try {
    // Atualiza o status da transação para "sucesso"
    await pool.query(
      'UPDATE transactions SET status = $1 WHERE transaction_id = $2',
      ['sucesso', transactionId]
    );
    console.log(`Transação ${transactionId} confirmada com sucesso`);

    // Envia a confirmação ao RabbitMQ para o serviço de notificação
    const channel = getChannel();
    if (channel) {
      await channel.assertQueue('notificationQueue', { durable: true });
      channel.sendToQueue(
        'notificationQueue',
        Buffer.from(JSON.stringify({ transactionId, status: 'sucesso' }))
      );
      console.log(`Mensagem de confirmação enviada para a fila: notificationQueue`);
    }
  } catch (error) {
    console.error(`Erro ao confirmar a transação ${transactionId}`, error);
  }
};

const processPayment = async (req, res) => {
  const { transactionId, amount } = req.body;

  try {
    // Insere a transação no banco com status "pendente"
    const result = await pool.query(
      'INSERT INTO transactions (transaction_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
      [transactionId, amount, 'pendente']
    );

    const transaction = result.rows[0];
    console.log("Transação armazenada no banco de dados:", transaction);

    // Obtém o canal do RabbitMQ
    const channel = getChannel();
    if (channel) {
      await channel.assertQueue('paymentQueue', { durable: true });

      try {
        console.log("Tentando enviar mensagem para a fila...");
        await channel.sendToQueue('paymentQueue', Buffer.from(JSON.stringify(transaction)));
        console.log("Mensagem enviada com sucesso para a fila: pagamento pendente");

        // Chamada simplificada de confirmTransaction após 5 segundos
        console.log("Iniciando temporizador de 5 segundos para confirmar a transação...");
        setTimeout(() => {
          console.log("Chamando confirmTransaction...");
          confirmTransaction(transactionId);
        }, 5000);

        // Envia a resposta ao cliente
        return res.status(200).json({ message: "Pagamento processado", transaction });
      } catch (sendError) {
        console.error("Erro ao enviar mensagem para a fila:", sendError);
        return res.status(500).json({ error: "Erro ao enviar mensagem para a fila" });
      }
    } else {
      console.error("Canal do RabbitMQ não disponível");
      return res.status(500).json({ error: "Erro ao conectar na fila" });
    }
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    res.status(500).json({ error: "Erro ao processar pagamento" });
  }
};


module.exports = { processPayment, confirmTransaction };
