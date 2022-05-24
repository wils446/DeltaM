import { Command } from "discord.js";
import { getEmbedMessage } from "../../utils/Utils";

const command: Command = {
	name: "autoplay",
	description: "Toggle autoplay",
	async execute(message) {
		const queue = message.guild?.queue;
		if (!queue) return;

		if (message.member?.voice.channel?.id !== queue.voiceChannel?.id) {
			await message.reply("Join dlu baru request :smirk:");
			return;
		}

		queue.setAutoPlay(!queue.autoplay);

		const msg = `🎧 Autoplay is now ${queue.autoplay ? "enabled" : "disabled"}`;
		await message.reply({
			embeds: [getEmbedMessage(msg)],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};

export default command;
