import { useEffect } from "react";
import { useAppStore } from "@/store/app.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./ContactsContainer.jsx";
import EmptyChatContainer from "./EmptyChatContainer";
import ChatContainer from "./ChatContainer";

export default function Chat() {
	const { userInfo } = useAppStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (!userInfo.profileSetup) {
			toast("Please complete your profile setup");
			navigate("/profile");
		}
	}, [userInfo, navigate]);

	return (
		<div className="flex h-[100vh] text-white overflow-hidden">
			<ContactsContainer />
			<EmptyChatContainer />
			<ChatContainer />
		</div>
	);
}
