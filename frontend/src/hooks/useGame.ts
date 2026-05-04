import { apiCreateGame } from "@/api/game";
import type { Room } from "@/models/game.models";
import { JoinGameSchema, SubmitAnswerSchema } from "@/modules/game.schemas";
import {
  socketEndGame,
  socketRoomCreate,
  socketRoomJoin,
  socketStartRound,
  socketSubmitAnswer,
} from "@/sockets/game";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useGame(roomId?: string | null) {
  const navigate = useNavigate();

  const [joinRoomId, setJoinRoomId] = useState<string>("");
  const [answer, setAnswer] = useState<number | null>(null);
  const [room, setRoom] = useState<Room>({
    status: "lobby",
    playerNumber: 0,
    round: 0,
  });
  const [socket, setSocket] = useState<WebSocket | null>(null);
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

  const startRoundMutation = useMutation({
    mutationFn: async (socket: WebSocket | null) => {
      if (!socket) {
        throw new Error("Pas de socket.");
      }

      socketStartRound(socket);
    },
    onError: (error) => {
      console.error("[useGame.startRound] failed", error);
      setFormError("Impossible de commencer le round.");
    },
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({
      socket,
      answer,
    }: {
      socket: WebSocket | null;
      answer: number | null;
    }) => {
      if (!socket) {
        throw new Error("Pas de socket.");
      }

      const formData = {
        answer: answer,
      };

      const result = SubmitAnswerSchema.safeParse(formData);

      if (!result.success) {
        const firstIssue = result.error.issues[0];
        throw new Error(firstIssue?.message ?? "Formulaire invalide.");
      }

      socketSubmitAnswer(socket, result.data.answer);
    },
  });

  const endGameMutation = useMutation({
    mutationFn: async (socket: WebSocket | null) => {
      if (!socket) {
        throw new Error("Pas de socket.");
      }

      socketEndGame(socket);
    },
    onSuccess: () => {
      navigate("/homepage");
    },
    onError: (error) => {
      console.error("[useGame.endGame] failed", error);
      setFormError("Impossible de terminer la partie.");
    },
  });

  async function createGame() {
    setFormError(null);
    setRoom({ status: "lobby", playerNumber: 0, round: 0 });

    await createGameMutation.mutateAsync();
  }

  async function joinGame(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setRoom({ status: "lobby", playerNumber: 0, round: 0 });

    await joinGameMutation.mutateAsync(joinRoomId);
  }

  async function startRound() {
    setFormError(null);

    await startRoundMutation.mutateAsync(socket);
  }

  async function submitAnswer(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    await submitAnswerMutation.mutateAsync({ socket, answer });
  }

  async function endGame() {
    setFormError(null);

    await endGameMutation.mutateAsync(socket);
  }

  useEffect(() => {
    if (!roomId) {
      setRoom({ status: "none", round: 0 });
      return;
    }

    const socket = socketRoomCreate(roomId);
    setSocket(socket);

    socketRoomJoin(socket);

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      setRoom(msg);
    };

    return () => {
      socket.close();
      setSocket(null);
    };
  }, [roomId]);

  return {
    room,
    createGame,
    joinGame,
    setJoinRoomId,
    answer,
    setAnswer,
    startRound,
    submitAnswer,
    endGame,
    loading:
      createGameMutation.isPending ||
      (room.status === "lobby" && !room?.playerNumber),
    formError,
  };
}
