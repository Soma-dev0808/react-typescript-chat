const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.findIndex(
    (user) => user.name === username && user.room === room
  );

  const user = { id, name: username, room };

  if (existingUser === -1) {
    users.push(user);
  } else {
    users[existingUser] = user;
  }

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getUsers = () => users;

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getUsers };
