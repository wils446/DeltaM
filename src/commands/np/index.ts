import { Command } from "discord.js";
import { getEmbedFromSong } from "../../utils/Utils";

const command: Command = {
	name: "np",
	description: "Show currently playing song",
	async execute(message) {
		const queue = message.guild?.queue;
		if (!queue) return;

		const song = queue.nowPlaying;
		if (!song) return;

		message.reply({
			embeds: [getEmbedFromSong(song, queue.createProgressBar().prettier)],
			allowedMentions: { repliedUser: false },
		});
	},
};

export default command;
