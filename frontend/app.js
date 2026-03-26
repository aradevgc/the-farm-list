let ws;
let token;

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Para empezar usamos fetch a un endpoint de login (simulado)
  token = "u1-token"; // en producción se obtiene del backend

  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";

  connectWebSocket();
}

function connectWebSocket() {
  ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "AUTH", token }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "INIT") {
      renderList(data.lists[0].items);
    }

    if (data.type === "ITEM_ADDED") {
      if (document.getElementById("list")) {
        const li = document.createElement("li");
        li.textContent = data.item.name;
        document.getElementById("list").appendChild(li);
      }
    }
  };
}

function addItem() {
  const value = document.getElementById("item").value;
  ws.send(JSON.stringify({ type: "ADD_ITEM", listId: "l1", name: value }));
}

function renderList(items) {
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.name;
    ul.appendChild(li);
  });
}