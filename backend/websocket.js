const WebSocket = require("ws");
const { getUserByToken } = require("./auth");
const { getListsByUser, addItem } = require("./database");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Nueva conexión");
    let currentUser = null;

    ws.on("message", (message) => {
      const data = JSON.parse(message);

      if (data.type === "AUTH") {
        const user = getUserByToken(data.token);
        if (!user) {
          ws.send(JSON.stringify({ error: "No autorizado" }));
          return;
        }
        currentUser = user;
        const lists = getListsByUser(user.id);
        ws.send(JSON.stringify({ type: "INIT", lists }));
      }

      if (data.type === "ADD_ITEM") {
        if (!currentUser) return;

        const item = {
          id: Date.now().toString(),
          name: data.name,
          checked: false,
          createdAt: Date.now()
        };

        addItem(data.listId, item);

        // enviar a todos los clientes
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: "ITEM_ADDED",
              listId: data.listId,
              item
            }));
          }
        });
      }
    });
  });
}

module.exports = { setupWebSocket };