import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/login";
import Register from "./pages/register";
import { useEffect } from "react";
import Homepage from "./pages/homepage";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", false);
  });

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
