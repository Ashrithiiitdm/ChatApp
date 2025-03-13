import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Chat from "./pages/Chat.jsx";
import Profile from "./pages/Profile.jsx";
import { useAppStore } from "./store/app";
import axios from "@/utils/axios.js";

const PrivateRoute = ({ children }) => {
	const { userInfo } = useAppStore();

	const isLoggedIn = !!userInfo;

	return isLoggedIn ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
	const { userInfo } = useAppStore();

	const isLoggedIn = !!userInfo;

	return isLoggedIn ? <Navigate to="/chat" /> : children;
};

export default function App() {
	const { userInfo, setUserInfo } = useAppStore();
	const [loading, setLoading] = useState(true);
	const backend_url = import.meta.env.VITE_BACKEND_URL;

	useEffect(() => {
		const getUserData = async () => {
			try {
				console.log("In getUserData");
				const response = await axios.get(`${backend_url}/api/auth/userInfo`, {
					withCredentials: true,
				});
				console.log("Response in useEffect", response);
				if (response.status === 200 && response.data.user_id) {
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
