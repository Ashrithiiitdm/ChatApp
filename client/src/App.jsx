import React from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Chat from "./pages/Chat.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/auth" element={<Login />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/chat" element={<Chat />} />

				<Route path="*" element={<Navigate to="/auth" />} />
			</Routes>
		</BrowserRouter>
	);
}
