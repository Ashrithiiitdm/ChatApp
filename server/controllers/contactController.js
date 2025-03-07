import { User } from "../models/userModel.js";

export const searchContacts = async (req, res) => {
	try {
		const { contact } = req.body;

		if (!contact) {
			return res.status(400).json({ message: "Contact is required" });
		}

		const cleanedContact = contact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

		const regex = new RegExp(cleanedContact, "i");

		const contacts = await User.find({
			$and: [
				{ _id: { $ne: req.user_id } },
				{
					$or: [{ first_name: regex }, { last_name: regex }, { email: regex }],
				},
			],
		});

		return res.status(200).json({ contacts });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};
