export const createChatSlice = (set, get) => ({
	selectedChatType: undefined,
	selectedChatData: undefined,
	selectedChatMessages: [],
	isUploading: false,
	isDownloading: false,
	fileUploadProgress: 0,
	fileDownloadProgress: 0,
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
});
