import InputPassword from "@/components/custom/inputPassword";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export default function Register() {
  const {
    navigate,
    setUsernameR,
    setEmailR,
    setPasswordR,
    setPasswordConfirmR,
    loading,
    error,
    register,
  } = useAuth();

  return (
    <main className="flex h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <Card className="min-w-80">
          <CardHeader>
            <CardTitle>S'inscrire</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={(e) => register(e)}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  type="text"
                  id="username"
                  onChange={(e) => setUsernameR(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  onChange={(e) => setEmailR(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <InputPassword
                  id="password"
                  onChange={(e) => setPasswordR(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="passwordConfirm">
                  Confirmer le mot de passe
                </Label>
                <InputPassword
                  id="passwordConfirm"
                  onChange={(e) => setPasswordConfirmR(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner /> : "Créer un compte"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-muted-foreground ml-4">
          Déjà un compte ?
          <Button
            variant="link"
            className="text-foreground"
            onClick={() => navigate("/login")}
          >
            Se connecter
          </Button>
        </p>
      </motion.div>
    </main>
  );
}
