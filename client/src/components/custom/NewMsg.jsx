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
	DialogTrigger,
} from "@/components/ui/dialog.jsx";
import { Input } from "../ui/input";
import axios from "@/utils/axios.js";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarImage } from "../ui/avatar";
import { getColor } from "@/lib/utils";

export default function NewMsg() {
	const [openNewContactModal, setOpenNewContactModal] = useState(false);

	const [searchedContacts, setSearchedContacts] = useState([]);

	const searchContacts = async (contact) => {
		try {
			console.log(contact);
			if (contact.length > 0) {
				console.log("Inside searchContacts", contact);
				const response = await axios.post(
					"/contacts/searchContacts",
					{ contact },
					{ withCredentials: true }
				);
				if (response.status === 200 && response.data.contacts) {
					setSearchedContacts(response.data.contacts);
				}
			} else {
				console.log("Else block");
				setSearchedContacts([]);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<FaPlus
							onClick={() => setOpenNewContactModal(true)}
							className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300 "
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
					<div>
						<Input
							placeholder="Search Contacts"
							className="rounded-lg p-6 bg-[#2c2e3b] border-none"
							onChange={(e) => searchContacts(e.target.value)}
						/>
					</div>
					<ScrollArea className="h-[250px]">
						<div className="flex flex-col gap-5">
							{searchedContacts.map((contact) => (
								<div
									key={contact.user_id}
									className="flex gap-3 items-center cursor-pointer "
								>
									<div className="w-12 h-12 relative">
										<Avatar className="h-12 w-12 rounded-full overflow-hidden">
											{contact.image ? (
												<AvatarImage
													src={`http://localhost:8080/${contact.image}`}
													alt="profile"
													className="object-cover w-full h-full bg-black"
												/>
											) : (
												<div
													className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
														contact.color
													)}`}
												>
													{contact.first_name
														? contact.first_name.split("").shift()
														: contact.email.split("").shift()}
												</div>
											)}
										</Avatar>
										<div className="flex gap-5">
											<span>
												{contact.first_name && contact.last_name
													? `${contact.first_name}${contact.last_name}`
													: ""}
											</span>
											<span className="text-xs">{contact.email}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
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
