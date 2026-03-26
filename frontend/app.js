// 👤 nombre del usuario
let username = "";

// 🔌 conexión al websocket (CAMBIA LA URL)
const socket = new WebSocket("wss://the-farm-list.onrender.com");

// 🚀 AL CARGAR
window.onload = () => {
  const savedUser = localStorage.getItem("username");

  if (savedUser) {
    username = savedUser;
    showApp();
  }
};

// 👤 guardar nombre
function start() {
  const input = document.getElementById("username").value;

  if (!input) {
    alert("Pon un nombre");
    return;
  }

  username = input;
  localStorage.setItem("username", username);

  showApp();
}

// 👀 mostrar app
function showApp() {
  document.getElementById("userSetup").style.display = "none";
  document.getElementById("app").style.display = "block";
}

// ➕ añadir producto
function addItem() {
  const itemInput = document.getElementById("item");
  const item = itemInput.value;

  if (!item) return;

  fetch("https://the-farm-list.onrender.com/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      item: item,
      user: username
    })
  });

  itemInput.value = "";
}

// 📡 recibir datos en tiempo real
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  renderItem(data);
};

// 🖥️ mostrar producto
function renderItem(data) {
  const li = document.createElement("li");
  li.textContent = `${data.text} (por ${data.user})`;

  document.getElementById("list").appendChild(li);
}