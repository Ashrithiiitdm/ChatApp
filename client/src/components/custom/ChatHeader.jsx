import { useAppStore } from "@/store/app.js";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "../ui/avatar";
import { getColor } from "@/lib/utils";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function ChatHeader() {
	const { closeChat, selectedChatData, selectedChatType } = useAppStore();

	return (
		<div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-center px-20">
			<div className="flex gap-5 items-center w-full justify-between">
				<div className="flex gap-3 items-center justify-center">
					<div className="w-12 h-12 relative">
						{selectedChatType === "contact" ? (
							<Avatar className="h-12 w-12 rounded-full overflow-hidden">
								{selectedChatData.image ? (
									<AvatarImage
										src={`${selectedChatData.image}`}
										alt="profile"
										className="object-cover w-full h-full bg-black"
									/>
								) : (
									<div
										className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(
											selectedChatData.color
										)}`}
									>
										{selectedChatData.first_name
											? selectedChatData.first_name[0]
											: selectedChatData.email[0]}
									</div>
								)}
							</Avatar>
						) : (
							<div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
								#
							</div>
						)}
					</div>
				</div>

				<div>
					{selectedChatType === "channel" && selectedChatData.name}
					{selectedChatType === "contact" &&
						`${selectedChatData.first_name} ${selectedChatData.last_name}`}
				</div>

				<div className="flex items-center justify-center gap-5">
					<button
						onClick={closeChat}
						className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
					>
						<RiCloseFill className="text-3xl" />
					</button>
				</div>
			</div>
		</div>
	);
}
