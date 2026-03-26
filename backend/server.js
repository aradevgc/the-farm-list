const express = require("express");
const app = express();
const WebSocket = require("ws");

app.use(express.json());

let items = [];

// 🌐 servidor HTTP
const server = app.listen(3000, () => {
  console.log("Servidor corriendo");
});

// 🔌 websocket
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);

  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
});

// 📡 enviar a todos
function broadcast(data) {
  clients.forEach(client => {
    client.send(JSON.stringify(data));
  });
}

// ➕ añadir producto
app.post("/add", (req, res) => {
  const { item, user } = req.body;

  const newItem = {
    text: item,
    user: user
  };

  items.push(newItem);

  broadcast(newItem);

  res.sendStatus(200);
});