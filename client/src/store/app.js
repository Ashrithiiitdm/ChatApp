import { create } from "zustand";
import { createAuthSlice } from "./authSlice.js";

export const useAppStore = create()((...a) => ({
	...createAuthSlice(...a),
}));
