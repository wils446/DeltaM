import { ICommand } from "discord.js";
import Utils from "../utils/Utils";

const command: ICommand = {
	name: "remove",
	description: "Remove a song from queue",
	aliases: ["r"],
	async execute(message, args) {
		const queue = message.guild?.queue;
		if (!queue) return;

		if (message.member?.voice.channel?.id !== queue.voiceChannel?.id) {
			await message.reply("Join dlu baru request :smirk:");
			return;
		}

		const index = +(args.shift() || queue.songs.length) - 1;

		const removed = queue.remove(index);

		if (removed) {
			const msg = `🚮 **${removed.name} removed from queue**`;
			message.reply({ embeds: [Utils.getEmbedMessage(msg)], allowedMentions: { repliedUser: false } });
		} else {
			const msg = "Invalid index!";
			message.reply({ embeds: [Utils.getEmbedMessage(msg)], allowedMentions: { repliedUser: false } });
		}
	},
};

export default command;