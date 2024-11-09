# Dockerfile para o serviço de pagamento

# Usa a imagem Node.js oficial
FROM node:18

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Exponha a porta 3000 para a API do serviço de pagamento
EXPOSE 3000

# Comando para iniciar o serviço
CMD sleep 10 && node src/app.js
