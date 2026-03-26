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