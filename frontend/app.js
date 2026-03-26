let username = "";
const API_URL = "https://the-farm-list.onrender.com"; // CAMBIA ESTO POR TU URL DE RENDER
const WS_URL = API_URL.replace("https://", "wss://");

let socket = new WebSocket(WS_URL);

window.onload = () => {
  const savedUser = localStorage.getItem("username");
  if (savedUser) {
    username = savedUser;
    showApp();
    loadItems();
  }
};

function showApp() {
  document.getElementById("userSetup").style.display = "none";
  document.getElementById("app").style.display = "block";
}

async function loadItems() {
  const res = await fetch(`${API_URL}/items`);
  const data = await res.json();
  document.getElementById("list").innerHTML = "";
  data.forEach(item => renderItem(item));
}

async function addItem() {
  const input = document.getElementById("item");
  if (!input.value) return;

  await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item: input.value, user: username, isTemplate: false })
  });
  input.value = "";
}

async function deleteItem(id) {
  await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
}

// Escuchar cambios en tiempo real
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === "DELETE") {
    const el = document.getElementById(`item-${data.id}`);
    if (el) el.remove();
  } else {
    renderItem(data);
  }
};

function renderItem(data) {
  const id = data._id || data.id;
  if (document.getElementById(`item-${id}`)) return;

  const li = document.createElement("li");
  li.id = `item-${id}`;
  li.innerHTML = `
    <span><strong>${data.text}</strong> <br> <small>por ${data.user}</small></span>
    <button onclick="deleteItem('${id}')" class="btn-delete">🗑️</button>
  `;
  document.getElementById("list").appendChild(li);
}