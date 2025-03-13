export const createChatSlice = (set, get) => ({
	selectedChatType: undefined,
	selectedChatData: undefined,
	selectedChatMessages: [],
	isUploading: false,
	isDownloading: false,
	fileUploadProgress: 0,
	fileDownloadProgress: 0,
	channels: [],
	directMessagesContacts: [],

	setChannels: (channels) => set({ channels }),
	setIsUploading: (isUploading) => set({ isUploading }),
	setIsDownloading: (isDownloading) => set({ isDownloading }),
	setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
	setFileDownloadProgress: (fileDownloadProgress) =>
		set({ fileDownloadProgress }),

	setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
	setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
	setSelectedChatMessages: (selectedChatMessages) =>
		set({ selectedChatMessages }),
	setDirectMessagesContacts: (directMessagesContacts) =>
		set({ directMessagesContacts }),

	addChannel: (channel) =>
		set((state) => ({ channels: [channel, ...state.channels] })),

	closeChat: () =>
		set({
			selectedChatData: undefined,
			selectedChatType: undefined,
			selectedChatMessages: [],
		}),

	addMessage: (message) =>
		set((state) => ({
			selectedChatMessages: [
				...state.selectedChatMessages,
				{
					...message,
					receiver:
						state.selectedChatType === "channel"
							? message.receiver
							: message.receiver._id,
					sender:
						state.selectedChatType === "channel"
							? message.sender
							: message.sender._id,
				},
			],
		})),

	addChannelInChannelList: (message) =>
		set((state) => {
			const updatedChannels = [...state.channels];
			const index = updatedChannels.findIndex(
				(channel) => channel._id === message.channel_id
			);

			if (index !== -1) {
				const [movedChannel] = updatedChannels.splice(index, 1);
				updatedChannels.unshift(movedChannel);
			}

			return { channels: updatedChannels };
		}),

	addContactsInDMContacts: (message) =>
		set((state) => {
			const user_id = get().userInfo.user_id;
			const from_id =
				message.sender._id === user_id
					? message.receiver._id
					: message.sender._id;
			const fromData =
				message.sender._id === user_id ? message.receiver : message.sender;

			const updatedContacts = [...state.directMessagesContacts];
			const index = updatedContacts.findIndex(
				(contact) => contact._id === from_id
			);

			if (index !== -1) {
				const [movedContact] = updatedContacts.splice(index, 1);
				updatedContacts.unshift(movedContact);
			} else {
				updatedContacts.unshift(fromData);
			}

			return { directMessagesContacts: updatedContacts };
		}),

	resetChatState: () =>
		set({
			selectedChatType: undefined,
			selectedChatData: undefined,
			selectedChatMessages: [],
			channels: [],
			directMessagesContacts: [],
		}),
});
