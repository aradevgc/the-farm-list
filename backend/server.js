const http = require("http");
const { setupWebSocket } = require("./websocket");


const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Servidor activo");
});

setupWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const express = require('express'); // Si usas express
const path = require('path');

// Esto sirve los archivos estáticos del frontend
server.use(express.static(path.join(__dirname, '../frontend')));
