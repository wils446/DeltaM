import { Command } from "discord.js";
import { getEmbedMessage } from "../../utils/Utils";

const command: Command = {
	name: "skip",
	description: "Skip currently playing song",
	async execute(message) {
		const queue = message.guild?.queue;
		if (!queue) return;

		if (!queue.nowPlaying) return message.reply("There is no song playing");

		const song = queue.songs[1];
		await message.reply({
			embeds: [getEmbedMessage(`**Skipped ${queue.songs[0].name}**`)],
			allowedMentions: {
				repliedUser: false,
			},
		});
		queue.skip();
		queue.onSongChanged(song);
	},
};

export default command;
