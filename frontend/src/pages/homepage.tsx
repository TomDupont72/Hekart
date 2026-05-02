import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  const { session, logOut, loading } = useAuth();
  const { createGame } = useGame();

  if (loading) {
    return (
      <main className="flex h-screen justify-center items-center">
        <Spinner className="size-8" />
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
          <CardContent className="flex flex-col items-center justify-center gap-18 pb-12 p-16">
            <h1 className="text-4xl"> Bonjour {session?.user.name}</h1>
            <div className="flex md:flex-row flex-col gap-8">
              <Button className="w-60 h-30 text-lg" onClick={createGame}>
                Créer une partie
              </Button>
              <Button
                className="w-60 h-30 text-lg"
                onClick={() => navigate("/game")}
              >
                Rejoindre une partie
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <Button
        className="absolute bottom-5 right-5"
        disabled={loading}
        onClick={logOut}
      >
        Se déconnecter
      </Button>
    </main>
  );
}
