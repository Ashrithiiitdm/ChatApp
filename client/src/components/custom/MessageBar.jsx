import { useAppStore } from "@/store/app";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useSocket } from "@/context/Socket.jsx";
import axiosInstance from "@/utils/axios";

export default function MessageBar() {
	const [message, setMessage] = useState("");
	const socket = useSocket();
	const {
		selectedChatType,
		selectedChatData,
		userInfo,
		setIsUploading,
		setFileUploadProgress,
	} = useAppStore();
	const emojiRef = useRef();
	const fileInput = useRef();
	const [emojiOpen, setEmojiOpen] = useState(false);

	useEffect(() => {
		function handleClickOutside(event) {
			if (emojiRef.current && !emojiRef.current.contains(event.target)) {
				setEmojiOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [emojiRef]);

	const handleAddImage = (emoji) => {
		setMessage((msg) => msg + emoji.emoji);
	};

	const handleSendMessage = async () => {
		if (selectedChatType === "contact") {
			socket.emit("sendMessage", {
				sender: userInfo.user_id,
				content: message,
				receiver: selectedChatData._id,
				message_type: "text",
				file_url: undefined,
			});
		} else if (selectedChatType === "channel") {
			socket.emit("sendChannelMessage", {
				sender: userInfo.user_id,
				content: message,
				message_type: "text",
				file_url: undefined,
				channel_id: selectedChatData._id,
			});
		}
		setMessage("");
	};

	const handleAttachmentClick = () => {
		if (fileInput.current) {
			fileInput.current.click();
		}
	};

	const handleAttachmentChange = async (event) => {
		try {
			const file = event.target.files[0];
			if (file) {
				const formData = new FormData();
				formData.append("file", file);
				setIsUploading(true);
				const response = await axiosInstance.post(
					"/messages/uploadFiles",
					formData,
					{
						withCredentials: true,
						onUploadProgess: (data) => {
							setFileUploadProgress(
								Math.round((100 * data.loaded) / data.total)
							);
						},
					}
				);
				if (response.status === 200 && response.data) {
					setIsUploading(false);
					if (selectedChatType === "contact") {
						socket.emit("sendMessage", {
							sender: userInfo.user_id,
							content: undefined,
							receiver: selectedChatData._id,
							message_type: "file",
							file_url: response.data.file_url,
						});
					} else if (selectedChatType === "channel") {
						socket.emit("sendChannelMessage", {
							sender: userInfo.user_id,
							content: undefined,
							message_type: "file",
							file_url: response.data.file_url,
							channel_id: selectedChatData._id,
						});
					}
				}
			}
		} catch (err) {
			setIsUploading(false);
			console.log(err);
		}
	};

	return (
		<div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
			<div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
				<input
					type="text"
					className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
					placeholder="Type a message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button
					onClick={handleAttachmentClick}
					className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
				>
					<GrAttachment className="text-2xl" />
				</button>
				<input
					type="file"
					className="hidden"
					ref={fileInput}
					onChange={handleAttachmentChange}
				/>
				<div className="relative">
					<button
						onClick={() => setEmojiOpen(true)}
						className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
					>
						<RiEmojiStickerLine className="text-2xl" />
					</button>
					<div className="absolute bottom-16 right-0" ref={emojiRef}>
						<EmojiPicker
							theme="dark"
							open={emojiOpen}
							onEmojiClick={handleAddImage}
							autoFocusSearch={false}
						/>
					</div>
				</div>
			</div>
			<button
				onClick={handleSendMessage}
				className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:bg-[#741bda] hover:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
			>
				<IoSend className="text-2xl" />
			</button>
		</div>
	);
}
