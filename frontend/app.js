let username = "";
const API_URL = "https://the-farm-list.onrender.com"; // Asegúrate que esta es tu URL
const socket = new WebSocket(API_URL.replace("https", "wss"));

window.onload = () => {
  const savedUser = localStorage.getItem("username");
  if (savedUser) {
    username = savedUser;
    showApp();
    loadItems(); // Carga lo que hay en la base de datos
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
    body: JSON.stringify({ item: input.value, user: username })
  });
  input.value = "";
}

async function deleteItem(id) {
  await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "DELETE") {
    document.getElementById(`item-${data.id}`)?.remove();
  } else if (data.type === "ADD") {
    renderItem(data.item);
  }
};

function renderItem(item) {
  const list = document.getElementById("list");
  const li = document.createElement("li");
  li.id = `item-${item._id}`;
  li.innerHTML = `
    <span>${item.text} <small>(por ${item.user})</small></span>
    <button onclick="deleteItem('${item._id}')" class="btn-del">❌</button>
  `;
  list.appendChild(li);
}