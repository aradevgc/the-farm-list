const crypto = require("crypto");

const users = [
  { id: "u1", email: "test@test.com", password: "1234" } // cambiar para producción
];

function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;
  const token = crypto.randomBytes(16).toString("hex");
  user.token = token;
  return token;
}

function getUserByToken(token) {
  return users.find(u => u.token === token);
}

module.exports = { login, getUserByToken };