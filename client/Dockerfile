FROM node:24-alpine
WORKDIR /app
COPY . .
RUN npm ci
ARG VITE_WEB_SERVER_NAME
ENV VITE_WEB_SERVER_NAME=$VITE_WEB_SERVER_NAME
RUN npm run build
RUN npm install -g http-server
EXPOSE 5173
CMD ["http-server", "dist", "-p", "5173"]