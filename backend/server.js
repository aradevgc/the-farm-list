app.post("/add", (req, res) => {
  const { item, user } = req.body;

  const newItem = {
    text: item,
    user: user
  };

  items.push(newItem);

  // enviar a todos (websocket)
  broadcast(newItem);

  res.sendStatus(200);
});