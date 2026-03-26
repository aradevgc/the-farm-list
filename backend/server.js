const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors()); // Permite que el frontend conecte con el backend

// 1. CONEXIÓN A MONGODB
const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error de conexión:", err));

// 2. MODELO DE DATOS
const ItemSchema = new mongoose.Schema({
  text: String,
  user: String,
  isTemplate: { type: Boolean, default: false }
});
const Item = mongoose.model("Item", ItemSchema);

// 3. RUTAS API
app.get("/items", async (req, res) => {
  const items = await Item.find({ isTemplate: false });
  res.json(items);
});

app.post("/add", async (req, res) => {
  const { item, user, isTemplate } = req.body;
  const newItem = new Item({ text: item, user, isTemplate: isTemplate || false });
  await newItem.save();
  if (!isTemplate) broadcast({ type: "ADD", item: newItem });
  res.json(newItem);
});

app.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  broadcast({ type: "DELETE", id: req.params.id });
  res.sendStatus(200);
});

// 4. WEBSOCKET Y SERVIDOR
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));