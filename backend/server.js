const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// 1. CONEXIÓN A MONGODB (Usa variable de entorno en Render)
const mongoURI = process.env.MONGO_URI || "TU_URL_DE_MONGODB_AQUI";
mongoose.connect(mongoURI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error de conexión:", err));

// 2. MODELO DE DATOS
const ItemSchema = new mongoose.Schema({
  text: String,
  user: String,
  isTemplate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Item = mongoose.model("Item", ItemSchema);

// 3. RUTAS API
// Obtener items de la lista
app.get("/items", async (req, res) => {
  const items = await Item.find({ isTemplate: false }).sort({ createdAt: 1 });
  res.json(items);
});

// Obtener plantillas
app.get("/templates", async (req, res) => {
  const templates = await Item.find({ isTemplate: true });
  res.json(templates);
});

// Añadir producto o plantilla
app.post("/add", async (req, res) => {
  const { item, user, isTemplate } = req.body;
  const newItem = new Item({ text: item, user, isTemplate: isTemplate || false });
  await newItem.save();
  
  if (!isTemplate) broadcast(newItem); // Solo avisar por socket si es a la lista real
  res.json(newItem);
});

// Borrar producto
app.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  broadcast({ type: "DELETE", id: req.params.id });
  res.sendStatus(200);
});

// 4. WEBSOCKET
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));