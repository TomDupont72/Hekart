import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";

export default function Homepage() {
  const { session, logOut, loading } = useAuth();

  return (
    <main className="flex h-screen items-center justify-center ">
      <Card className="flex flex-col items-center justify-center gap-18 pb-12 p-16">
        <h1 className="text-4xl"> Bonjour {session?.user.name}</h1>
        <div className="flex md:flex-row flex-col gap-8">
          <Button className="w-60 h-30 text-lg">Créer une partie</Button>
          <Button className="w-60 h-30 text-lg">Rejoindre une partie</Button>
        </div>
      </Card>
      <Button
        className="absolute bottom-5 right-5"
        disabled={loading}
        onClick={logOut}
      >
        {loading ? <Spinner /> : "Se déconnecter"}
      </Button>
    </main>
  );
}
