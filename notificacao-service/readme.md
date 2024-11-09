# Serviço de Notificação

Este serviço de notificação faz parte de um sistema de pagamento e notificação. Ele se conecta a uma fila RabbitMQ, escuta mensagens de eventos de pagamento e processa notificações quando as transações mudam de status.

## Tecnologias

- **Node.js**: Para a lógica do serviço de notificação.
- **RabbitMQ**: Gerencia a fila de mensagens e permite que o serviço de notificação receba eventos do serviço de pagamento.
- **Docker & Docker Compose**: Para gerenciamento e configuração dos contêineres.

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Docker** e **Docker Compose**

## Configuração do Projeto

### 1. Clone o Repositório

Clone o repositório que contém o serviço de notificação:

```bash
git clone https://github.com/joselidivino/projeto-pagamento-notificacao.git
cd projeto-pagamento-notificacao/notificacao-service
```

## 2. Executando o projeto

Para executar o projeto, digite no terminal:
``` bash
node src/app.js 
```

Os logs e as mensagens aprecerão no console.
