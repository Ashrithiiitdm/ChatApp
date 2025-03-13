import { getColor } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar.jsx";
import { useAppStore } from "@/store/app.js";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { FiEdit2 } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/axios.js";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function ProfileInfo() {
	const { userInfo, setUserInfo } = useAppStore();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			const response = await axios.post(
				"/auth/logout",
				{},
				{ withCredentials: true }
			);

			if (response.status === 200) {
				navigate("/auth");
				setUserInfo(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="absolute bottom-0 w-full bg-[#2a2b33] p-4 flex items-center justify-between">
			<div className="flex items-center gap-3">
				<Avatar className="h-12 w-12 rounded-full overflow-hidden">
					{userInfo.image ? (
						<AvatarImage
							src={`${backend_url}/${userInfo.image}`}
							alt="profile"
							className="object-cover w-full h-full bg-black"
						/>
					) : (
						<div
							className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
								userInfo.color
							)}`}
						>
							{userInfo.first_name ? userInfo.first_name[0] : userInfo.email[0]}
						</div>
					)}
				</Avatar>
				<span className="text-white text-lg font-medium">
					{userInfo.first_name && userInfo.last_name
						? `${userInfo.first_name} ${userInfo.last_name}`
						: ""}
				</span>
			</div>

			<div className="flex gap-4">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<FiEdit2
								onClick={() => navigate("/profile")}
								className="text-purple-500 text-xl cursor-pointer"
							/>
						</TooltipTrigger>
						<TooltipContent className="bg-[#1c1b13] text-white">
							Edit Profile
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<IoLogOut
								onClick={handleLogout}
								className="text-red-500 text-xl cursor-pointer"
							/>
						</TooltipTrigger>
						<TooltipContent className="bg-[#1c1b13] text-white">
							Logout
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}
