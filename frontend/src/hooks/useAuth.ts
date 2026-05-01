import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useNavigate, useLocation } from "react-router-dom";
import { apiLogOut, apiSignIn, apiSignUp } from "@/api/auth";
import { RegisterSchema, SignInSchema } from "@/modules/auth.schemas";
import { useMutation } from "@tanstack/react-query";
import type { AppSession } from "@/models/auth.models";

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: session } = authClient.useSession();

  const [emailSI, setEmailSI] = useState("");
  const [passwordSI, setPasswordSI] = useState("");

  const [usernameR, setUsernameR] = useState("");
  const [emailR, setEmailR] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [passwordConfirmR, setPasswordConfirmR] = useState("");

  const [formError, setFormError] = useState<string | null>(null);

  const signInMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const formData = {
        email,
        password,
      };

      const result = SignInSchema.safeParse(formData);

      if (!result.success) {
        const firstIssue = result.error.issues[0];
        throw new Error(firstIssue?.message ?? "Formulaire invalide.");
      }

      return apiSignIn(result.data.email, result.data.password);
    },
    onSuccess: (data) => {
      localStorage.setItem(
        "session",
        JSON.stringify({
          user: {
            email: data.user.email,
            name: data.user.name,
            id: data.user.id,
          },
          createdAt: data.user.createdAt,
        } as AppSession),
      );

      navigate("/homepage", { replace: true });
    },
    onError: (error) => {
      console.error("[useAuth.signIn] failed", error);
      setFormError("Impossible de se connecter.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      passwordConfirm,
      username,
    }: {
      email: string;
      password: string;
      passwordConfirm: string;
      username: string;
    }) => {
      const formData = {
        email,
        password,
        passwordConfirm,
        username,
      };

      const result = RegisterSchema.safeParse(formData);

      if (!result.success) {
        const firstIssue = result.error.issues[0];
        throw new Error(firstIssue?.message ?? "Formulaire invalide.");
      }

      return apiSignUp(
        result.data.email,
        result.data.password,
        result.data.username,
      );
    },
    onSuccess: (data) => {
      localStorage.setItem(
        "session",
        JSON.stringify({
          user: {
            email: data.user.email,
            name: data.user.name,
            id: data.user.id,
          },
          createdAt: data.user.createdAt,
        } as AppSession),
      );

      navigate("/homepage", { replace: true });
    },
    onError: (error) => {
      console.error("[useAuth.register] failed", error);
      setFormError("Impossible de s'inscrire.");
    },
  });

  const logOutMutation = useMutation({
    mutationFn: async () => {
      return apiLogOut();
    },
    onSuccess: () => {
      localStorage.removeItem("session");
    },
    onError: (error) => {
      console.error("[useAuth.logOut] failed", error);
      setFormError("Impossible de se déconnecter.");
    },
  });

  async function signIn(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    await signInMutation.mutateAsync({
      email: emailSI,
      password: passwordSI,
    });
  }

  async function register(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    await registerMutation.mutateAsync({
      email: emailR,
      password: passwordR,
      passwordConfirm: passwordConfirmR,
      username: usernameR,
    });
  }

  async function logOut() {
    setFormError(null);

    await logOutMutation.mutateAsync();
  }

  useEffect(() => {
    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    if (session) {
      localStorage.setItem(
        "session",
        JSON.stringify({
          user: {
            email: session.user.email,
            name: session.user.name,
            id: session.user.id,
          },
          expiresAt: session.session.expiresAt,
          createdAt: session.user.createdAt,
        } as AppSession),
      );

      if (isPublicRoute) navigate("/homepage", { replace: true });

      return;
    }

    if (!isPublicRoute) navigate("/login", { replace: true });
  }, [session, navigate]);

  return {
    navigate,
    setEmailSI,
    setPasswordSI,
    setUsernameR,
    setEmailR,
    setPasswordR,
    setPasswordConfirmR,
    loading:
      signInMutation.isPending ||
      registerMutation.isPending ||
      logOutMutation.isPending,
    error: formError,
    setError: setFormError,
    signIn,
    register,
    logOut,
    session,
  };
}
