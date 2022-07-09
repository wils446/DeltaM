import { ICommand, MessageEmbed } from "discord.js";
import LyricProvider from "../modules/lyric/LyricProvider";

const command: ICommand = {
	name: "lyric",
	description: "Search for a song lyric",
	async execute(message, args) {
		const queue = message.guild?.queue;
		const lyric = new LyricProvider();

		const songTitle = args.length ? args.join(" ") : queue?.nowPlaying?.name;
		if (!songTitle) return;

		const responseLyrics = await lyric.getLyric(songTitle);

		if (!responseLyrics) {
			await message.reply({ content: "No lyrics found", allowedMentions: { repliedUser: false } });
			return;
		}

		const embed = new MessageEmbed({
			title: `${responseLyrics?.title} - ${responseLyrics?.author}`,
			description: responseLyrics?.content,
			color: "GREEN",
		});

		await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	},
};

export default command;
