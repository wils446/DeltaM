import { RepeatMode } from "discord-music-player";
import { Command } from "discord.js";
import { getEmbedMessage, getRepeatStateMessage } from "../../utils/Utils";

const command: Command = {
	name: "loop",
	description: "Loop Song",
	async execute(message) {
		const queue = message.guild?.queue;
		if (!queue) return;

		if (message.member?.voice.channel?.id !== queue.voiceChannel?.id) {
			await message.reply("Join dlu baru request :smirk:");
			return;
		}

		let repeatMode = RepeatMode.SONG;
		if (queue.repeatMode === repeatMode) repeatMode = RepeatMode.DISABLED;

		queue.setRepeatMode(repeatMode);

		message.reply({
			embeds: [getEmbedMessage(getRepeatStateMessage(queue.repeatMode))],
			allowedMentions: { repliedUser: false },
		});
	},
};

export default command;
