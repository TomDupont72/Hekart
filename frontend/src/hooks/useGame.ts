import { apiCreateGame } from "@/api/game";
import type { Room } from "@/models/game.models";
import { JoinGameSchema } from "@/modules/game.schemas";
import { socketRoomCreate, socketRoomJoin } from "@/sockets/game";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useGame(roomId?: string | null) {
  const navigate = useNavigate();

  const [joinRoomId, setJoinRoomId] = useState<string>("");
  const [room, setRoom] = useState<Room>({ playerNumber: 0 });
  const [formError, setFormError] = useState<string | null>(null);

  const createGameMutation = useMutation({
    mutationFn: async () => {
      const res = await apiCreateGame();
      return res.data;
    },
    onSuccess: (data) => {
      navigate(`/game/${data}`);
    },
    onError: (error) => {
      console.error("[useGame.createGame] failed", error);
      setFormError("Impossible de créer une partie.");
    },
  });

  const joinGameMutation = useMutation({
    mutationFn: async (roomId: string) => {
      const formData = {
        roomId,
      };

      const result = JoinGameSchema.safeParse(formData);

      if (!result.success) {
        const firstIssue = result.error.issues[0];
        throw new Error(firstIssue?.message ?? "Formulaire invalide.");
      }

      return result.data.roomId;
    },
    onSuccess: (data) => {
      navigate(`/game/${data}`);
    },
    onError: (error) => {
      console.error("[useGame.joinGame] failed", error);
      setFormError("Impossible de rejoindre la partie.");
    },
  });

  async function createGame() {
    setFormError(null);

    await createGameMutation.mutateAsync();
  }

  async function joinGame(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    await joinGameMutation.mutateAsync(joinRoomId);
  }

  useEffect(() => {
    if (!roomId) return;

    const socket = socketRoomCreate(roomId);

    socketRoomJoin(socket);

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      console.log(msg);

      setRoom(msg);
    };
  }, [roomId]);

  return { room, createGame, joinGame, setJoinRoomId };
}
