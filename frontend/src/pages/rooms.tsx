import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRooms } from "@/hooks/useRooms";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const navigate = useNavigate();

  const { rooms } = useRooms();

  return (
    <main className="flex flex-col h-screen items-center justify-center gap-6">
      {Object.keys(rooms).map((key) => (
        <Card key={key}>
          <CardContent className="flex flex-row gap-6">
            <h1>{key}</h1>
            <p>Joueurs : {rooms[key]} / 10</p>
          </CardContent>
        </Card>
      ))}
      <Button variant="destructive" onClick={() => navigate("/homepage")}>
        Revenir au menu
      </Button>
    </main>
  );
}
