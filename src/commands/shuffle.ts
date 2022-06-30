import { Song } from "discord-music-player";
import { ICommand } from "discord.js";
import Utils from "../utils/Utils";

const command: ICommand = {
	name: "shuffle",
	description: "Shuffle the queue",
	async execute(message) {
		const queue = message.guild?.queue;
		if (!queue) return;

		if (message.member?.voice.channel?.id !== queue.voiceChannel?.id) {
			await message.reply("Join dlu baru request :smirk:");
			return;
		}

		if (queue.songs.length < 2)
			return await message.reply({
				embeds: [Utils.getEmbedMessage("There is no song in the queue to shuffle")],
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