let username = "";
const API_URL = "https://the-farm-list.onrender.com"; // Asegúrate de que sea TU url de Render
const WS_URL = API_URL.replace("https://", "wss://");

const socket = new WebSocket(WS_URL);

window.onload = () => {
  const savedUser = localStorage.getItem("username");
  if (savedUser) {
    username = savedUser;
    showApp();
    loadItems(); // Cargar la lista existente
  }
};

function start() {
  const input = document.getElementById("username").value;
  if (!input) return alert("Pon un nombre");
  username = input;
  localStorage.setItem("username", username);
  showApp();
  loadItems();
}

function showApp() {
  document.getElementById("userSetup").style.display = "none";
  document.getElementById("app").style.display = "block";
}

// Cargar lista desde el servidor (vía HTTP)
async function loadItems() {
  const res = await fetch(`${API_URL}/items`);
  const data = await res.json();
  document.getElementById("list").innerHTML = ""; // Limpiar antes de cargar
  data.forEach(item => renderItem(item));
}

// Añadir producto
async function addItem() {
  const itemInput = document.getElementById("item");
  const item = itemInput.value;
  if (!item) return;

  await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item, user: username })
  });

  itemInput.value = "";
}

// Escuchar cambios en tiempo real
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  renderItem(data);
};

function renderItem(data) {
  const li = document.createElement("li");
  li.textContent = `${data.text} (por ${data.user})`;
  document.getElementById("list").appendChild(li);
}