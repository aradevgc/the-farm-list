const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Importante para que funcione desde cualquier sitio

let items = []; // Aquí se guardan los productos temporalmente

// 1. Ruta para ver los items actuales al cargar la página
app.get("/items", (req, res) => {
  res.json(items);
});

// 2. Ruta para añadir items
app.post("/add", (req, res) => {
  const { item, user } = req.body;
  if (!item || !user) return res.sendStatus(400);

  const newItem = { text: item, user: user, id: Date.now() };
  items.push(newItem);

  broadcast(newItem); // Avisar a todos por WebSocket
  res.status(200).json(newItem);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket: Enviar a todos los conectados
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Render usa la variable de entorno PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor volando en el puerto ${PORT}`);
});