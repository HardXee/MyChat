import instance from "./socket";

export const createRoomID = (userA, userB) => {
  return [userA, userB].sort().join("_");
};

export const joinRoom = (myId, friendId) => {
  const roomId = createRoomID(myId, friendId);

  instance.emit("join_room", roomId);

  return roomId;
};

export const sendMessage = (data) => {
  instance.emit("send_message", data);
};
