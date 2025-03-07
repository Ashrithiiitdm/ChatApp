import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

export default function MessageBar() {
	const [message, setMessage] = useState("");

	const emojiRef = useRef();
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

	const handleSendMessage = async () => {};

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
				<button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
					<GrAttachment className="text-2xl" />
				</button>

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
