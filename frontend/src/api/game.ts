const apiUrl = import.meta.env.VITE_API_URL;

export async function apiCreateGame() {
  const res = await fetch(`${apiUrl}/api/game/create-game`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to create game");
  }

  return res.json();
}
