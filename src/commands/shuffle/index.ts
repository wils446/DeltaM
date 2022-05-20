import { Song } from "discord-music-player";
import { Command } from "discord.js";
import { getEmbedMessage } from "../../utils/Utils";

const command: Command = {
	name: "shuffle",
	description: "Shuffle the queue",
	async execute(message) {
		const queue = message.guild?.queue;
		if (!queue) return;

		if (queue.songs.length < 2)
			return await message.reply({
				embeds: [getEmbedMessage("There is no song in the queue to shuffle")],
				allowedMentions: { repliedUser: false },
			});

		queue.songs = [
			queue.songs[0],
			...(queue.shuffle()?.filter((song) => song !== queue.songs[0]) as Song[]),
		];

		await message.react("🔀");
	},
};

export default command;
