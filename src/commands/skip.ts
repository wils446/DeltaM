import { ICommand } from "discord.js";
import Utils from "../utils/Utils";

const command: ICommand = {
	name: "skip",
	description: "Skip currently playing song",
	async execute(message) {
		const queue = message.guild?.queue;
		if (!queue) return;

		if (message.member?.voice.channel?.id !== queue.voiceChannel?.id) {
			await message.reply("Join dlu baru request :smirk:");
			return;
		}

		if (!queue.nowPlaying) return message.reply("There is no song playing");

		const song = queue.songs[1];
		await message.reply({
			embeds: [Utils.getEmbedMessage(`**Skipped ${queue.songs[0].name}**`)],
			allowedMentions: {
				repliedUser: false,
			},
		});
		queue.skip();
		queue.onSongChanged(song);
	},
};

export default command;