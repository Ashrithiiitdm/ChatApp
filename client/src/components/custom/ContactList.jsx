import { useAppStore } from "@/store/app";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";

const backend_url = import.meta.env.VITE_BACKEND_URL;
// console.log(backend_url);

export default function ContactList({ contacts, isChannel = false }) {
	const {
		selectedChatData,
		setSelectedChatData,
		setSelectedChatType,
		selectedChatType,
		setSelectedChatMessages,
	} = useAppStore();

	const handleClick = (contact) => {
		if (isChannel) {
			setSelectedChatType("channel");
		} else {
			setSelectedChatType("contact");
		}
		setSelectedChatData(contact);
		if (selectedChatData && selectedChatData._id !== contact._id) {
			setSelectedChatMessages([]);
		}
	};

	return (
		<div className="mt-5">
			{contacts.map((contact) => (
				<div
					key={contact._id}
					className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
						selectedChatData && selectedChatData._id === contact._id
							? "bg-[#8417ff] hover:bg-[#8417ff]/90 "
							: "hover:bg-[#f1f1f111]"
					}`}
					onClick={() => handleClick(contact)}
				>
					<div className="flex gap-5 items-center justify-start text-neutral-300">
						{!isChannel && (
							<Avatar className="h-10 w-10 rounded-full overflow-hidden">
								{contact.image ? (
									<AvatarImage
										src={`${contact.image}`}
										alt="profile"
										className="object-cover w-full h-full bg-black"
									/>
								) : (
									<div
										className={`${
											selectedChatData && selectedChatData._id === contact._id
												? "bg-[#ffffff22] border border-white/70"
												: getColor(contact.color)
										}uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full
										)}`}
									>
										{contact.first_name
											? contact.first_name[0]
											: contact.email[0]}
									</div>
								)}
							</Avatar>
						)}
						{isChannel && (
							<div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
								#
							</div>
						)}
						{isChannel ? (
							<span>{contact.name}</span>
						) : (
							<span>
								{contact.first_name
									? `${contact.first_name} ${contact.last_name}`
									: contact.email}
							</span>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
