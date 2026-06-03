import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/login";
import Register from "./pages/register";
import { useEffect } from "react";
import Homepage from "./pages/homepage";
import Game from "./pages/game";
import Rooms from "./pages/rooms";
import Legal from "./pages/legal";

export default function App() {
    useEffect(() => {
        document.documentElement.classList.toggle("dark", false);
    });

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/game/:roomId" element={<Game />} />
            <Route path="/game" element={<Game />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}
