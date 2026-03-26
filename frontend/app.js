let username = "";

window.onload = () => {
  const saved = localStorage.getItem("username");

  if (saved) {
    username = saved;
    showApp();
  }
};

function start() {
  const input = document.getElementById("username").value;

  if (!input) return alert("Pon un nombre");

  username = input;
  localStorage.setItem("username", username);

  showApp();
}

function showApp() {
  document.getElementById("userSetup").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function addItem() {
  const item = document.getElementById("item").value;

  fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      item,
      user: username
    })
  });
}

function renderItem(data) {
  const li = document.createElement("li");
  li.textContent = `${data.text} (por ${data.user})`;

  document.getElementById("list").appendChild(li);
}