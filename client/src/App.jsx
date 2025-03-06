import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Chat from "./pages/Chat.jsx";
import Profile from "./pages/Profile.jsx";
import { useAppStore } from "./store/app";
import axios from "@/utils/axios.js";

const PrivateRoute = ({ Children }) => {
	const { userInfo } = useAppStore();

	const isLoggedIn = !!userInfo;

	return isLoggedIn ? Children : <Navigate to="/auth" />;
};

const AuthRoute = ({ Children }) => {
	const { userInfo } = useAppStore();

	const isLoggedIn = !!userInfo;

	return isLoggedIn ? <Navigate to="/chat" /> : Children;
};

export default function App() {
	const { userInfo, setUserInfo } = useAppStore();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getUserData = async () => {
			try {
				const response = await axios.get("/auth/userInfo", {
					withCredentials: true,
				});
				console.log(response);
				if (
					(response.success === 200 || response.success === 201) &&
					response.data.user_id
				) {
					console.log(response.data);
					setUserInfo(response.data);
				} else {
					setUserInfo(undefined);
				}
			} catch (err) {
				console.log(err.response);

				setUserInfo(undefined);
			} finally {
				setLoading(false);
			}
		};
		if (!userInfo) {
			console.log(userInfo);
			getUserData();
		} else {
			setLoading(false);
		}
	}, [userInfo, setUserInfo]);

	if (loading) {
		return <div>Loading....</div>;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/auth"
					element={
						<AuthRoute>
							<Login />
						</AuthRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<PrivateRoute>
							<Profile />
						</PrivateRoute>
					}
				/>
				<Route
					path="/chat"
					element={
						<PrivateRoute>
							<Chat />
						</PrivateRoute>
					}
				/>

				<Route path="*" element={<Navigate to="/auth" />} />
			</Routes>
		</BrowserRouter>
	);
}
