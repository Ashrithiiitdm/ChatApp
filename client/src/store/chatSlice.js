export const createChatSlice = (set, get) => ({
	selectedChatType: undefined,
	selectedChatData: undefined,
	selectedChatMessages: [],
	isUploading: false,
	isDownloading: false,
	fileUploadProgress: 0,
	fileDownloadProgress: 0,
	channels: [],
	setChannels: (channels) => set({ channels }),

	setIsUploading: (isUploading) => set({ isUploading }),
	setIsDownloading: (isDownloading) => set({ isDownloading }),
	setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
	setFileDownloadProgress: (fileDownloadProgress) =>
		set({ fileDownloadProgress }),
	directMessagesContacts: [],
	setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
	setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
	setSelectedChatMessages: (selectedChatMessages) =>
		set({ selectedChatMessages }),
	setDirectMessagesContacts: (directMessagesContacts) =>
		set({ directMessagesContacts }),
	addChannel: (channel) => {
		const channels = get().channels;
		set({ channels: [channel, ...channels] });
	},
	closeChat: () =>
		set({
			selectedChatData: undefined,
			selectedChatType: undefined,
			selectedChatMessages: [],
		}),

	addMessage: (message) => {
		const selectedChatMessages = get().selectedChatMessages;
		const selectedChatType = get().selectedChatType;

		set({
			selectedChatMessages: [
				...selectedChatMessages,
				{
					...message,
					receiver:
						selectedChatType === "channel"
							? message.receiver
							: message.receiver._id,

					sender:
						selectedChatType === "channel"
							? message.sender
							: message.sender._id,
				},
			],
		});
	},
	addChannelInChannelList: (message) => {
		const channels = get().channels;
		const data = channels.find((channel) => channel._id === message.channel_id);
		const index = channels.findIndex(
			(channel) => channel._id === message.channel_id
		);

		if (index !== -1 && index !== undefined) {
			channels.splice(index, 1);
			channels.unshift(data);
		}
	},

	addContactsInDMContacts: (message) => {
		const user_id = get().userInfo.user_id;

		const from_id =
			message.sender._id === user_id
				? message.receiver._id
				: message.sender._id;

		const fromData =
			message.sender._id === user_id ? message.receiver : message.sender;

		const dmContacts = get().directMessagesContacts;

		const data = dmContacts.find((contact) => contact._id === from_id);

		const index = dmContacts.findIndex((contact) => contact._id === from_id);

		if (index !== -1 && index !== undefined) {
			dmContacts.splice(index, 1);
			dmContacts.unshift(data);
		} else {
			dmContacts.unshift(data);
		}

		set({ directMessagesContacts: dmContacts });
	},
});
