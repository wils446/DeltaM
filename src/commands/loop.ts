import { RepeatMode } from "discord-music-player";
import { ICommand } from "discord.js";
import Utils from "../utils/Utils";

const command: ICommand = {
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
			embeds: [Utils.getEmbedMessage(Utils.getRepeatStateMessage(queue.repeatMode))],
			allowedMentions: { repliedUser: false },
		});
	},
};

export default command;
