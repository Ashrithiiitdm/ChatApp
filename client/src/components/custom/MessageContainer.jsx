import { useAppStore } from "@/store/app.js";
import axios from "@/utils/axios.js";
import moment from "moment";
import React, { useEffect, useRef } from "react";

export default function MessageContainer() {
	const scrollRef = useRef(null);
	const {
		selectedChatType,
		selectedChatData,
		selectedChatMessages,
		userInfo,
		setSelectedChatMessages,
	} = useAppStore();

	useEffect(() => {
		const getMessages = async () => {
			try {
				const response = await axios.post(
					"/messages/getMessages",
					{ user_id: selectedChatData._id },
					{ withCredentials: true }
				);

				if (response.status === 200 && response.data.messages) {
					setSelectedChatMessages(response.data.messages);	
				}
			} catch (err) {
				console.log(err);
			}
		};
		if (selectedChatData._id) {
			if (selectedChatType === "contact") {
				getMessages();
			}
		}
	}, [selectedChatData, selectedChatType, selectedChatMessages]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [selectedChatMessages]);

	const renderDMMessages = (message) => {
		// console.log("Message: ", message);
		return (
			<div
				className={`${
					message.sender === selectedChatData._id ? "text-left" : "text-right"
				}`}
			>
				{message.message_type === "text" && (
					<div
						className={`${
							message.sender !== selectedChatData._id
								? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
								: "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
						} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
					>
						{message.content}
					</div>
				)}
				<div className="text-xs text-gray-600">
					{moment(message.timestamp).format("LT")}
				</div>
			</div>
		);
	};

	const renderMessages = () => {
		let lastDate = null;
		return selectedChatMessages.map((message, index) => {
			const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
			const showDate = messageDate !== lastDate;
			lastDate = messageDate;

			return (
				<div key={index}>
					{showDate && (
						<div className="text-center text-gray-500 my-2">
							{moment(message.timestamp).format("LL")}
						</div>
					)}
					{selectedChatType === "contact" && renderDMMessages(message)}
				</div>
			);
		});
	};

	return (
		<div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
			{renderMessages()}
		</div>
	);
}
