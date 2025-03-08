import { create } from "zustand";
import { createAuthSlice } from "./authSlice.js";
import { createChatSlice } from "./chatSlice.js";

export const useAppStore = create()((...a) => ({
	...createAuthSlice(...a),
	...createChatSlice(...a),
}));
