# Projeto de Serviço de Pagamento e Notificação

Este é um sistema de pagamento e notificação construído em Node.js, PostgreSQL e RabbitMQ, gerenciado via Docker Compose. O projeto consiste em dois serviços principais: `pagamento-service`, que processa e armazena transações, e `notificacao-service`, que escuta eventos de transação e envia notificações.

## Tecnologias

- **Node.js**: Para a lógica de backend.
- **PostgreSQL**: Banco de dados para armazenamento das transações.
- **RabbitMQ**: Broker de mensagens para comunicação entre serviços.
- **Docker & Docker Compose**: Para gerenciamento e configuração dos contêineres.

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Docker** e **Docker Compose**

## Configuração do Projeto

### 1. Clone o Repositório

Clone o repositório para a sua máquina:

```bash
git clone https://github.com/joselidivino/projeto-pagamento-notificacao.git

cd projeto-pagamento-notificacao
```

## 2. Configuração das Variáveis de Ambiente
Em cada serviço (pagamento-service e notificacao-service), temos um arquivo .env com as variáveis de ambiente necessárias.

Exemplo de .env para pagamento-service
```plaintext
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=payments
POSTGRES_HOST=db
POSTGRES_PORT=5432
```
Exemplo de .env para notificacao-service

```plaintext
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

## 3. Executar o Projeto com Docker Compose
Inicie todos os serviços com o Docker Compose:

```bash
sudo docker-compose up -d --build
```
ou

Se quiser que os log permaneçam na tela, execute:
```bash
sudo docker-compose up --build
```

Esse comando criará e iniciará os contêineres para o PostgreSQL, RabbitMQ, pagamento-service e notificacao-service.

### Acessar os Serviços
 - Serviço de Pagamento: Acesse: http://localhost:3000 para enviar requisições de pagamento.
 - Painel do RabbitMQ: Acesse http://localhost:15672 (usuário: guest, senha: guest).

Testar o Fluxo de Pagamento
Envie uma Requisição de Pagamento usando Postman ou curl:

```bash
curl -X POST http://localhost:3000/api/pay \
-H "Content-Type: application/json" \
-d '{"transactionId": "12345", "amount": 100.0}'
```

### Monitore o Processo de Confirmação Automática:

A transação é criada com o status "pendente".
Após 5 segundos, o status da transação é automaticamente atualizado para "sucesso", e uma notificação é enviada ao serviço de notificação.
Verifique os Logs: O serviço de notificação deve mostrar a transação recebida com status "pendente" e, em seguida, com status "sucesso" após a confirmação automática.

## 4. Parar os Contêineres
Para parar e remover todos os contêineres:

```bash
sudo docker-compose down
```

Monitorar os Logs
Para ver os logs em tempo real de todos os contêineres:

```bash
sudo docker-compose logs -f
```

## 5. Estrutura do Código
 - **paymentController.js:** Gerencia a criação e confirmação de transações no serviço de pagamento.
 - **notificationController.js:** Escuta eventos de transação e envia notificações.
 - **RabbitMQ:** Configurado para gerenciar a fila de mensagens entre os serviços.
 - **PostgreSQL:** Armazena as transações com status inicial "pendente" e, após confirmação, "sucesso".
