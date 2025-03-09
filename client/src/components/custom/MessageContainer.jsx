import { useAppStore } from "@/store/app.js";
import axios from "@/utils/axios.js";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowDown } from "react-icons/io";
import axiosInstance from "@/utils/axios.js";
import { IoCloseSharp } from "react-icons/io5";
const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function MessageContainer() {
	const scrollRef = useRef(null);
	const {
		selectedChatType,
		selectedChatData,
		selectedChatMessages,
		userInfo,
		setSelectedChatMessages,
		setIsDownloading,
		setFileDownloadProgress,
	} = useAppStore();

	const [showImage, setshowImage] = useState(false);
	const [imageUrl, setImageUrl] = useState(null);

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

	const checkImage = (file_url) => {
		const imageRegex =
			/\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
		return imageRegex.test(file_url);
	};

	const downloadFile = async (file_url) => {
		setIsDownloading(true);
		setFileDownloadProgress(0);
		const response = await axiosInstance.get(`${backend_url}/${file_url}`, {
			responseType: "blob",
			onDownloadProgress: (progessEvent) => {
				const { loaded, total } = progessEvent;
				setFileDownloadProgress(Math.round((100 * loaded) / total));
			},
		});

		const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = urlBlob;
		link.setAttribute("download", file_url.split("/").pop());
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(urlBlob);
		setIsDownloading(false);
		setFileDownloadProgress(0);
	};

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
				{message.message_type === "file" && (
					<div
						className={`${
							message.sender !== selectedChatData._id
								? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
								: "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
						} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
					>
						{checkImage(message.file_url) ? (
							<div
								onClick={() => {
									setshowImage(true);
									setImageUrl(message.file_url);
								}}
								className="cursor-pointer"
							>
								<img
									src={`${backend_url}/${message.file_url}`}
									alt="file"
									height={300}
									width={300}
								/>
							</div>
						) : (
							<div className="flex items-center justify-center gap-4">
								<span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
									<MdFolderZip size={24} />
								</span>
								<span>{message.file_url.split("/").pop(".")}</span>
								<span
									onClick={() => downloadFile(message.file_url)}
									className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
								>
									<IoMdArrowDown />
								</span>
							</div>
						)}
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
			<div ref={scrollRef} />
			{showImage && (
				<div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
					<div>
						<img
							src={`${backend_url}/${imageUrl}`}
							className="h-[80vh] w-full bg-cover"
						/>
					</div>
					<div className="flex gap-5 fixed top-0 mt-5">
						<button
							onClick={() => downloadFile(imageUrl)}
							className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
						>
							<IoMdArrowDown />
						</button>
						<button
							onClick={() => {
								setshowImage(false);
								setImageUrl(null);
							}}
							className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
						>
							<IoCloseSharp />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
