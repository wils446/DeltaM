import { ICommand } from "discord.js";
import Utils from "../utils/Utils";

const command: ICommand = {
	name: "np",
	description: "Show currently playing song",
	async execute(message) {
		const queue = message.guild?.queue;
		if (!queue) return;

		const song = queue.nowPlaying;
		if (!song) return;

		message.reply({
			embeds: [Utils.getEmbedFromSong(song, false, queue.createProgressBar().prettier)],
			allowedMentions: { repliedUser: false },
		});
	},
};

export default command;