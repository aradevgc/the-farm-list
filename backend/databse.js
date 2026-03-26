const lists = [
  {
    id: "l1",
    name: "Lista compartida",
    users: ["u1"],
    items: []
  }
];

function getListsByUser(userId) {
  return lists.filter(l => l.users.includes(userId));
}

function addItem(listId, item) {
  const list = lists.find(l => l.id === listId);
  if (!list) return;
  list.items.push(item);
}

module.exports = { getListsByUser, addItem, lists };