import ContactList from "@/components/custom/ContactList";
import CreateChannel from "@/components/custom/CreateChannel";
import NewMsg from "@/components/custom/NewMsg";
import ProfileInfo from "@/components/custom/ProfileInfo.jsx";
import { useAppStore } from "@/store/app";
import axios from "@/utils/axios.js";
import React, { useEffect } from "react";

export default function ContactsContainer() {
	const {
		setDirectMessagesContacts,
		directMessagesContacts,
		channels,
		setChannels,
	} = useAppStore();

	useEffect(() => {
		const getContacts = async () => {
			const response = await axios.get("/api/contacts/getContacts", {
				withCredentials: true,
			});
			// console.log("In ContactContainer", response);
			if (response.data.contacts) {
				setDirectMessagesContacts(response.data.contacts);
			}
		};
		getContacts();

		const getChannels = async () => {
			const response = await axios.get("/api/channels/getUserChannels", {
				withCredentials: true,
			});

			if (response.data.channels) {
				setChannels(response.data.channels);
			}
		};

		getChannels();
	}, []);

	return (
		<div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
			<div className="my-5">
				<div className="flex items-center justify-between pr-10">
					<Title text="Direct Messages" />
					<NewMsg />
				</div>
				<div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
					<ContactList contacts={directMessagesContacts} />
				</div>
			</div>

			<div className="my-5">
				<div className="flex items-center justify-between pr-10">
					<Title text="Channels" />
					<CreateChannel />
				</div>
				<div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
					<ContactList contacts={channels} isChannel={true} />
				</div>
			</div>
			<ProfileInfo />
		</div>
	);
}

const Title = ({ text }) => {
	return (
		<h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
			{text}
		</h6>
	);
};
