import ChatHeader from "@/components/custom/ChatHeader.jsx";
import MessageBar from "@/components/custom/MessageBar.jsx";
import MessageContainer from "@/components/custom/MessageContainer.jsx";
import React from "react";

export default function ChatContainer() {
	return (
		<div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
			<ChatHeader />
			<MessageContainer />
			<MessageBar />
		</div>
	);
}
