import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const navigate = useNavigate();

  const { session } = useAuth();

  if (!session?.user.isAdmin) navigate("/homepage");

  return (
    <main className="flex h-screen items-center justify-center">
      <Button variant="destructive" onClick={() => navigate("/homepage")}>
        Revenir au menu
      </Button>
    </main>
  );
}
