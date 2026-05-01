import InputPassword from "@/components/custom/inputPassword";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

export default function Login() {
  const { navigate, setEmailSI, setPasswordSI, loading, error, signIn } =
    useAuth();

  return (
    <main className="flex h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <Card className="min-w-90">
          <CardHeader>
            <CardTitle>Se connecter</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={(e) => signIn(e)}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  onChange={(e) => setEmailSI(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <InputPassword
                  id="password"
                  onChange={(e) => setPasswordSI(e.target.value)}
                />
              </div>
              <Button disabled={loading} type="submit">
                {loading ? <Spinner /> : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-muted-foreground ml-4">
          Pas encore de compte ?
          <Button
            variant="link"
            className="text-foreground"
            onClick={() => navigate("/register")}
          >
            S'inscrire
          </Button>
        </p>
      </motion.div>
    </main>
  );
}
