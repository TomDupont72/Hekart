const socketUrl = import.meta.env.VITE_SOCKET_URL;

export function socketRoomCreate(roomId: string) {
  return new WebSocket(`${socketUrl}/ws/game/room/${roomId}`);
}

export function socketRoomsCreate() {
  return new WebSocket(`${socketUrl}/ws/game/rooms`);
}

export function socketRoomJoin(socket: WebSocket) {
  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: "join",
      }),
    );
  };
}

export function socketSetParameters(socket: WebSocket, mode: string) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      type: "set_parameters",
      mode: mode,
    }),
  );
}

export function socketStartRound(socket: WebSocket) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      type: "start_round",
    }),
  );
}

export function socketSubmitAnswer(socket: WebSocket, answer: number) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      type: "submit_answer",
      answer: answer,
    }),
  );
}

export function socketLeaveGame(socket: WebSocket) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      type: "leave_game",
    }),
  );
}

export function socketGetRooms(socket: WebSocket) {
  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: "get_rooms",
      }),
    );
  };
}
