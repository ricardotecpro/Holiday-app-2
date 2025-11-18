# Estágio 1: Construir o aplicativo React
FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código-fonte do aplicativo
COPY . .

# Constrói o aplicativo
RUN npm run build

# Estágio 2: Servir o aplicativo com Nginx
FROM nginx:alpine

# Copia o resultado da compilação do estágio de compilação
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx quando o contêiner for iniciado
CMD ["nginx", "-g", "daemon off;"]
