import { socketGetRooms, socketRoomsCreate } from "@/sockets/game";
import { useEffect, useState } from "react";

export function useRooms() {
  const [rooms, setRooms] = useState<Record<string, number>>({});

  useEffect(() => {
    const socket = socketRoomsCreate();

    socketGetRooms(socket);

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setRooms(msg.data);
    };

    return () => {
      socket.close();
    };
  }, []);

  return {
    rooms,
  };
}
