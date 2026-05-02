const socketUrl = import.meta.env.VITE_SOCKET_URL;

export function socketRoomCreate(roomId: string) {
  return new WebSocket(`${socketUrl}/ws/game/room/${roomId}`);
}

export function socketRoomJoin(socket: WebSocket) {
  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: "join",
      }),
    );
  };

  return socket;
}
