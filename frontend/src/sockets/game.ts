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
