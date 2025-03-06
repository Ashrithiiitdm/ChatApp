import { useEffect } from "react";
import { useAppStore } from "@/store/app.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Chat() {
	const { userInfo } = useAppStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (!userInfo.profileSetup) {
			toast("Please complete your profile setup");
			navigate("/profile");
		}
	}, [userInfo, navigate]);

	return <div>Chat</div>;
}
