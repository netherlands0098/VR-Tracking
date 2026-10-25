# VR-Tracking — Gesture Studio

Projeto experimental de rastreamento de mãos em tempo real usando JavaScript e MediaPipe Tasks Vision.

## Recursos
- Rastreamento de mãos pela câmera.
- Processamento dos pontos de referência das mãos.
- Reconhecimento e tratamento de gestos.
- Comunicação com um servidor WebSocket local.

## Requisitos
- Node.js e npm.
- Navegador compatível com as APIs utilizadas.
- Permissão para acessar a câmera.

## Executar no Termux

Instale as dependências:

    npm install

Em um terminal, inicie o servidor web:

    npx http-server -c-1

Em outro terminal, inicie o servidor WebSocket:

    node server.js

O cliente utiliza o endereço `ws://127.0.0.1:3000`. Para acessar o
servidor a partir de outros dispositivos, será necessário configurar
o endereço de conexão e disponibilizar um servidor WebSocket acessível.

## GitHub

O GitHub pode armazenar o código e hospedar os arquivos estáticos com
GitHub Pages. Ele não executa automaticamente `server.js` como servidor
WebSocket permanente.

## Privacidade

Consulte o aviso de privacidade do MediaPipe em `tasks-vision/README.md`.
O processamento da entrada ocorre no dispositivo, mas a API pode enviar
métricas de utilização ao Google, conforme o aviso do MediaPipe.

## Dependências de terceiros

O projeto inclui arquivos do MediaPipe Tasks Vision 1.0.1, licenciado
sob Apache-2.0. Consulte `tasks-vision/package.json`.

## Estado
Projeto experimental em desenvolvimento.
