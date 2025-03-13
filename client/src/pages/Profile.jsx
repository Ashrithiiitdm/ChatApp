import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/app.js";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "@/utils/axios.js";

export default function Profile() {
	const navigate = useNavigate();

	const { userInfo, setUserInfo } = useAppStore();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [image, setImage] = useState(null);
	const [hovered, setHovered] = useState(false);
	const [selectedColor, setSelectedColor] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	const fileInput = useRef(null);
	const backend_url = import.meta.env.VITE_BACKEND_URL;

	useEffect(() => {
		if (userInfo.profileSetup) {
			setFirstName(userInfo.first_name);
			setLastName(userInfo.last_name);
			setSelectedColor(userInfo.color);
		}

		if (userInfo.image) {
			setImage(`${userInfo.image}`);
		}
	}, [userInfo]);

	const validateProfile = () => {
		if (!firstName) {
			toast.error("First name is required");
			return false;
		}
		if (!lastName) {
			toast.error("Last name is required");
			return false;
		}
		return true;
	};

	const saveChanges = async () => {
		if (!validateProfile() || isUploading) return;

		try {
			const response = await axios.post(
				"/api/auth/updateProfile",
				{ firstName, lastName, color: selectedColor },
				{ withCredentials: true }
			);
			if (response.status === 200 && response.data) {
				setUserInfo({ ...response.data });
				toast.success("Profile updated successfully");
				navigate("/chat");
			}
		} catch (err) {
			console.log(err);
			toast.error(err.response.data.message);
		}
	};

	// console.log(userInfo);

	const handleNavigate = () => {
		if (userInfo.profileSetup) {
			navigate("/chat");
		} else {
			toast.error("Please complete your profile setup");
			// navigate('/profile');
		}
	};

	const handleImageInput = () => {
		fileInput.current.click();
	};

	const handleImageChange = async (event) => {
		try {
			const file = event.target.files[0];
			// console.log({ file })
			if (file) {
				// console.log(file);
				// console.log("File Size in Bytes:", file.size); // Debugging step
				const sizeMB = file.size / (1024 * 1024);
				// console.log("File Size in MB:", file.size / (1024 * 1024));
				if (sizeMB > 100) {
					toast.error("File size should be less than 100MB");
					return;
				}

				const formData = new FormData();
				formData.append("profile-image", file);
				setIsUploading(true);
				const response = await axios.post("/api/auth/uploadImage", formData, {
					withCredentials: true,
				});

				if (response.status === 200 && response.data) {
					setUserInfo({ ...userInfo, image: response.data.image });
					toast.success("Profile pic updated successfully");
				}

				const reader = new FileReader();
				reader.onload = () => {
					setImage(reader.result);
				};

				reader.readAsDataURL(file);
			}
		} catch (err) {
			console.log(err);
		} finally {
			setIsUploading(false);
		}
	};

	const handleRemoveImage = async () => {
		try {
			const response = await axios.delete("/api/auth/removeImage", {
				withCredentials: true,
			});

			if (response.status === 200) {
				setUserInfo({ ...userInfo, image: null });
				toast.success("Profile pic removed successfully");
				setImage(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
			<div className="flex flex-col gap-10 w-[80vw] md:w-max">
				<div>
					<IoArrowBack
						onClick={handleNavigate}
						className="text-4xl lg:text-6xl text-white/90 cursor-pointer "
					/>
				</div>

				<div className="grid grid-cols-2">
					<div
						className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
					>
						<Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
							{image ? (
								<AvatarImage
									src={image}
									alt="profile"
									className="object-cover w-full h-full bg-black"
								/>
							) : (
								<div
									className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
										selectedColor
									)}`}
								>
									{firstName
										? firstName.split("").shift()
										: userInfo.email.split("").shift()}
								</div>
							)}
						</Avatar>
						{hovered && (
							<div
								className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
								onClick={image ? handleRemoveImage : handleImageInput}
							>
								{image ? (
									<FaTrash className="text-white text-3xl cursor-pointer" />
								) : (
									<FaPlus className="text-white text-3xl cursor-pointer" />
								)}
							</div>
						)}
						<input
							type="file"
							ref={fileInput}
							className="hidden"
							onChange={handleImageChange}
							name="profile-image"
							accept=".png, .jpg, .jpeg, .svg, .webp"
						/>
					</div>
					<div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
						<div className="w-full">
							<Input
								placeholder="Email"
								type="email"
								disabled
								value={userInfo.email}
								className="rounded-lg p-6 bg-[#2c2e3b] border-none"
							/>
						</div>
						<div className="w-full">
							<Input
								placeholder="First Name"
								type="text"
								onChange={(e) => setFirstName(e.target.value)}
								value={firstName}
								className="rounded-lg p-6 bg-[#2c2e3b] border-none"
							/>
						</div>
						<div className="w-full">
							<Input
								placeholder="Last Name"
								type="text"
								onChange={(e) => setLastName(e.target.value)}
								value={lastName}
								className="rounded-lg p-6 bg-[#2c2e3b] border-none"
							/>
						</div>
						<div className="w-full flex gap-5">
							{colors.map((color, index) => (
								<div
									className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
										selectedColor === index
											? "outline outline-white/50 outline-1"
											: ""
									}`}
									key={index}
									onClick={() => setSelectedColor(index)}
								></div>
							))}
						</div>
					</div>
				</div>
				<div className="w-full">
					<Button
						className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
						onClick={saveChanges}
					>
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
}
