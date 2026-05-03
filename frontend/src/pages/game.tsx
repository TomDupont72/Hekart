import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import Timer from "@/components/custom/timer";

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>();

  const navigate = useNavigate();

  const {
    room,
    joinGame,
    setJoinRoomId,
    answer,
    setAnswer,
    startRound,
    submitAnswer,
    loading,
  } = useGame(roomId);

  if (loading) {
    return (
      <main className="flex h-screen justify-center items-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  if (!roomId) {
    return (
      <main className="flex h-screen items-center justify-center ">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <Card>
            <CardContent>
              <form
                className="flex flex-col items-center justify-center gap-8 pb-12 p-16"
                onSubmit={(e) => {
                  joinGame(e);
                }}
              >
                <h1 className="text-3xl">Rejoindre une partie</h1>
                <Input
                  type="text"
                  placeholder="Id de la partie"
                  onChange={(e) => setJoinRoomId(e.target.value)}
                />
                <div className="flex md:flex-row flex-col gap-8">
                  <Button type="submit" className="w-60 h-20 text-lg">
                    Rejoindre la partie
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-60 h-20 text-lg"
                    onClick={() => navigate("/homepage")}
                  >
                    Revenir au menu
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  if (room.status === "lobby") {
    return (
      <main className="flex h-screen items-center justify-center ">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-8 pb-12 p-16">
              <h1 className="text-2xl">Id de la partie : {roomId}</h1>
              <p className="text-2xl">
                Joueurs dans la partie : {room.playerNumber ?? 0}/10
              </p>
              <div className="flex md:flex-row flex-col gap-8">
                <Button className="w-60 h-20 text-lg" onClick={startRound}>
                  Commencer la partie
                </Button>
                <Button
                  variant="destructive"
                  className="w-60 h-20 text-lg"
                  onClick={() => navigate("/homepage")}
                >
                  Quitter la partie
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  if (room.status === "playing" && !room.submitted) {
    return (
      <main className="flex h-screen items-center justify-center ">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <Card>
            <CardContent>
              <form
                className="flex flex-col items-center justify-center gap-8 pb-12 p-16"
                onSubmit={(e) => {
                  submitAnswer(e);
                }}
              >
                <h1 className="text-2xl text-center">
                  {room.question?.question}{" "}
                  {room.question?.unit && `(${room.question.unit})`}
                </h1>
                <div className="flex flex-1 flex-row items-center gap-8">
                  <Input
                    type="text"
                    placeholder="Réponse"
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <Timer
                    endTime={room.roundEndsAt}
                    totalSeconds={room.roundDuration}
                  />
                </div>
                <Button type="submit" className="w-60 h-20 text-lg">
                  Valider
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  if (room.status === "playing" && room.submitted) {
    return (
      <main className="flex h-screen items-center justify-center ">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <Card>
            <CardContent>
              <h1 className="text-2xl text-center">Votre réponse : {answer}</h1>
              <p className="text-2xl">
                En attente de {room.answerNotSubmittedNumber}{" "}
                {(room.answerNotSubmittedNumber ?? 0) > 1
                  ? "joueurs"
                  : "joueur"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  if (room.status === "results") {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-6">
        <h1>{room.question.question}</h1>
        <p>
          Réponse : {room.question.answer} {room.question.unit}
        </p>
        <p>
          Moyenne : {room.mean} {room.question.unit}
        </p>
        {Object.keys(room?.players ?? {}).map((key) => (
          <Card
            className="flew flex-row items-center justify-center gap-4"
            key={key}
          >
            <h1>{room.players[key].name}</h1>
            <p>{room.answers[key]}</p>
            <p>{room.players[key].score}</p>
          </Card>
        ))}
      </main>
    );
  }
}
