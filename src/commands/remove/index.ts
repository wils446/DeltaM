import { Command } from "discord.js";
import { getEmbedMessage } from "../../utils/Utils";

const command: Command = {
	name: "remove",
	description: "Remove a song from queue",
	aliases: ["r"],
	async execute(message, args) {
		const queue = message.guild?.queue;
		if (!queue) return;

		const index = +(args.shift() || queue.songs.length) - 1;

		const removed = queue.remove(index);

		if (removed) {
			const msg = `🚮 **${removed.name} removed from queue**`;
			message.reply({ embeds: [getEmbedMessage(msg)], allowedMentions: { repliedUser: false } });
		} else {
			const msg = "Invalid index!";
			message.reply({ embeds: [getEmbedMessage(msg)], allowedMentions: { repliedUser: false } });
		}
	},
};

export default command;
