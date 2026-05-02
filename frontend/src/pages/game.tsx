import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>();

  const navigate = useNavigate();

  const { room } = useGame(roomId);

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
                  e.preventDefault();
                }}
              >
                <h1 className="text-3xl">Rejoindre une partie</h1>
                <Input type="text" placeholder="Id de la partie" id="roomId" />
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
              Joueurs dans la partie : {room.playerNumber}/10
            </p>
            <div className="flex md:flex-row flex-col gap-8">
              <Button className="w-60 h-20 text-lg">Commencer la partie</Button>
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
