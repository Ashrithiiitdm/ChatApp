import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Input } from "../ui/input.jsx";
import axios from "@/utils/axios.js";
import { ScrollArea } from "../ui/scroll-area.jsx";
import { Avatar, AvatarImage } from "../ui/avatar.jsx";
import { getColor } from "@/lib/utils.js";
import { useAppStore } from "@/store/app.js";

export default function NewMsg() {
	const { setSelectedChatType, setSelectedChatData } = useAppStore();
	const [openNewContactModal, setOpenNewContactModal] = useState(false);
	const [searchedContacts, setSearchedContacts] = useState([]);
	const backend_url = import.meta.env.VITE_BACKEND_URL;
	const searchContacts = async (contact) => {
		try {
			if (contact.length > 0) {
				const response = await axios.post(
					"/api/contacts/searchContacts",
					{ contact },
					{ withCredentials: true }
				);
				if (response.status === 200 && response.data.contacts) {
					setSearchedContacts(response.data.contacts);
				}
			} else {
				setSearchedContacts([]);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const selectNewContact = (contact) => {
		setOpenNewContactModal(false);
		setSelectedChatType("contact");
		setSelectedChatData(contact);
		setSearchedContacts([]);
	};

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<FaPlus
							onClick={() => setOpenNewContactModal(true)}
							className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
						/>
					</TooltipTrigger>
					<TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
						Select new contact
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
				<DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
					<DialogHeader>
						<DialogTitle>Please select a Contact</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>

					{/* Search Input */}
					<div>
						<Input
							placeholder="Search Contacts"
							className="rounded-lg p-6 bg-[#2c2e3b] border-none"
							onChange={(e) => searchContacts(e.target.value)}
						/>
					</div>

					{/* Scrollable Contacts List */}
					<ScrollArea className="h-[250px]">
						<div className="flex flex-col gap-5">
							{searchedContacts.map((contact) => (
								<div
									key={contact._id}
									className="flex gap-3 items-center cursor-pointer"
									onClick={() => selectNewContact(contact)}
								>
									<Avatar className="h-12 w-12 rounded-full overflow-hidden">
										{contact.image ? (
											<AvatarImage
												src={`${backend_url}/${contact.image}`}
												alt="profile"
												className="object-cover w-full h-full bg-black"
											/>
										) : (
											<div
												className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${getColor(
													contact.color
												)}`}
											>
												{contact.first_name
													? contact.first_name[0]
													: contact.email[0]}
											</div>
										)}
									</Avatar>

									{/* Name & Email */}
									<div className="flex flex-col">
										<span className="font-medium text-sm">
											{contact.first_name && contact.last_name
												? `${contact.first_name} ${contact.last_name}`
												: contact.email}
										</span>
										<span className="text-xs text-gray-400">
											{contact.email}
										</span>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>

					{/* No Contacts Found */}
					{searchedContacts.length <= 0 && (
						<div className="flex items-center justify-center mt-4 p-4 bg-[#2c2e3b] rounded-md border border-gray-700 text-gray-300 text-sm italic">
							No contacts found
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
