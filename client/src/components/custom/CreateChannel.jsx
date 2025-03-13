import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { useEffect, useState } from "react";
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
import { useAppStore } from "@/store/app.js";
import { Button } from "../ui/button.jsx";
import MultipleSelector from "../ui/mutliselect.jsx";

export default function CreateChannel() {
	const { setSelectedChatType, setSelectedChatData, addChannel } =
		useAppStore();
	const [newChannelModal, setNewChannelModal] = useState(false);
	const [searchedContacts, setSearchedContacts] = useState([]);
	const [allContacts, setAllContacts] = useState([]);
	const [selectedContacts, setSelectedContacts] = useState([]);
	const [channelName, setChannelName] = useState("");

	useEffect(() => {
		const getData = async () => {
			const response = await axios.get("/api/contacts/getAllContacts", {
				withCredentials: true,
			});

			if (response.status === 200 && response.data.contacts) {
				setAllContacts(response.data.contacts);
			}
		};
		getData();
	}, []);

	const createChannel = async () => {
		try {
			if (channelName.length > 0 && selectedContacts.length > 0) {
				const response = await axios.post(
					"/api/channels/createChannel",
					{
						name: channelName,
						members: selectedContacts.map((contact) => contact.value),
					},
					{ withCredentials: true }
				);

				if (response.status === 200) {
					setChannelName("");
					setSelectedContacts([]);
					setNewChannelModal(false);
					addChannel(response.data.channel);
				}
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
							onClick={() => setNewChannelModal(true)}
							className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
						/>
					</TooltipTrigger>
					<TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
						Create New Channel
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
				<DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
					<DialogHeader>
						<DialogTitle>Please fill up details for New Channel</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>

					{/* Search Input */}
					<div>
						<Input
							placeholder="Channel Name"
							className="rounded-lg p-6 bg-[#2c2e3b] border-none"
							onChange={(e) => setChannelName(e.target.value)}
							value={channelName}
						/>
					</div>
					<div>
						<MultipleSelector
							className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
							defaultOptions={allContacts}
							placeholder="Select Contacts"
							value={selectedContacts}
							onChange={setSelectedContacts}
							emptyIndicator={
								<p className="text-center text-lg leading-10 text-gray-800">
									No contacts found
								</p>
							}
						/>
					</div>
					<div>
						<Button
							className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
							onClick={createChannel}
						>
							Create Channel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
