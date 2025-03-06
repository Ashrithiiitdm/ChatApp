import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "@/utils/axios.js";
import { useAppStore } from "@/store/app.js";

export default function Login() {
	const navigate = useNavigate();

	const { setUserInfo } = useAppStore();
	const [showPassword, setShowPassword] = useState(false);
	const [activeTab, setActiveTab] = useState("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [fullName, setFullName] = useState("");

	const validateLogin = () => {
		if (!email.length) {
			toast.error("Email is required");
			return false;
		}

		if (!password.length) {
			toast.error("Password is required");
			return false;
		}

		return true;
	};

	const validateSignUp = () => {
		if (!email.length) {
			toast.error("Email is required");
			return false;
		}

		if (!password.length) {
			toast.error("Password is required");
			return false;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return false;
		}

		return true;
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		if (!validateSignUp()) {
			return;
		}

		try {
			const response = await axios.post(
				"/auth/signup",
				{ email, password },
				{ withCredentials: true }
			);
			console.log(response);

			if (response.status === 201) {
				setUserInfo(response.data.user);
				toast.success("Signup successful");
				navigate("/profile");
			}
		} catch (err) {
			console.log(err);
			toast.error("Signup failed. Please try again");
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!validateLogin()) {
			return;
		}

		try {
			const response = await axios.post(
				"/auth/login",
				{ email, password },
				{ withCredentials: true }
			);

			if (response.data.user.user_id) {
				toast.success("Login successful");
				console.log(response.data.user);
				setUserInfo(response.data.user);
				if (response.data.user.profileSetup) {
					navigate("/chat");
				} else {
					navigate("/profile");
				}
			}
		} catch (err) {
			console.log(err);
			toast.error("Login failed. Please try again");
		}
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
			<div className="bg-white border border-gray-100 shadow-xl w-full max-w-5xl rounded-3xl overflow-hidden grid xl:grid-cols-2">
				{/* Left column - Forms */}
				<div className="flex flex-col gap-6 p-6 md:p-10">
					<div className="flex flex-col gap-2 text-center">
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
							Welcome
						</h1>
						<p className="text-gray-500 font-medium">
							Sign in to your account to continue
						</p>
					</div>

					<div className="w-full max-w-md mx-auto mt-4">
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="w-full"
						>
							<TabsList className="grid grid-cols-2 w-full mb-8">
								<TabsTrigger
									value="login"
									className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 rounded-none py-3"
								>
									Login
								</TabsTrigger>
								<TabsTrigger
									value="signup"
									className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 rounded-none py-3"
								>
									Signup
								</TabsTrigger>
							</TabsList>

							{/* Login Form */}
							<TabsContent value="login" className="mt-0">
								<form className="space-y-6" onSubmit={handleLogin}>
									<div className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<div className="relative">
												<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
												<Input
													id="email"
													type="email"
													placeholder="Enter your email"
													className="pl-10"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
												/>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex justify-between">
												<Label htmlFor="password">Password</Label>
												<Link
													href="#"
													className="text-sm text-purple-600 hover:text-purple-800"
												>
													Forgot password?
												</Link>
											</div>
											<div className="relative">
												<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
												<Input
													id="password"
													type={showPassword ? "text" : "password"}
													placeholder="Enter your password"
													className="pl-10"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</div>
									</div>

									<div className="flex items-center space-x-2">
										<Checkbox id="remember" />
										<Label htmlFor="remember" className="text-sm font-normal">
											Remember me
										</Label>
									</div>

									<Button
										type="submit"
										className="w-full bg-purple-600 hover:bg-purple-700"
									>
										Sign In
									</Button>
								</form>
							</TabsContent>

							{/* Signup Form */}
							<TabsContent value="signup" className="mt-0">
								<form className="space-y-6" onSubmit={handleSignup}>
									<div className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="signup-email">Email</Label>
											<div className="relative">
												<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
												<Input
													id="signup-email"
													type="email"
													placeholder="Enter your email"
													className="pl-10"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="signup-password">Password</Label>
											<div className="relative">
												<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
												<Input
													id="signup-password"
													type={showPassword ? "text" : "password"}
													placeholder="Create a password"
													className="pl-10"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="confirm-password">Confirm Password</Label>
											<div className="relative">
												<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
												<Input
													id="confirm-password"
													type={showPassword ? "text" : "password"}
													placeholder="Confirm your password"
													className="pl-10"
													value={confirmPassword}
													onChange={(e) => setConfirmPassword(e.target.value)}
												/>
											</div>
										</div>
									</div>

									<Button
										type="submit"
										className="w-full bg-purple-600 hover:bg-purple-700"
									>
										Create Account
									</Button>
								</form>
							</TabsContent>
						</Tabs>
					</div>
				</div>
				<div className="hidden xl:block relative bg-gradient-to-br from-purple-500 to-indigo-600">
					<div className="absolute inset-0 flex items-center justify-center p-10">
						<div className="max-w-md text-white">
							<h2 className="text-3xl font-bold mb-4">
								Start your journey with us
							</h2>
							<p className="mb-6">
								Access all features and benefits by creating an account or
								signing in.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
