import { animationDefaults } from "@/lib/utils.js";
import React from "react";
import Lottie from "react-lottie";

export default function EmptyChatContainer() {
	return (
		<div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
			<Lottie
				isClickToPauseDisabled={true}
				height={200}
				width={200}
				options={animationDefaults}
			/>
			<div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center"></div>
			<h3 className="poppins-medium text-4xl lg:text-5xl">Hi<span className="text-purple-500">!</span> Welcome to <span className="text-purple-300">ChatApp</span></h3>
		</div>
	);
}
