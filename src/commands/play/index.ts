import { RawSong, Song, Utils } from "discord-music-player";
import { Command, TextChannel } from "discord.js";
import { Client, LiveVideo } from "youtubei";
import { getEmbedFromSong, getEmbedMessage } from "../../utils/Utils";

const command: Command = {
	name: "play",
	description: "Play a Song",
	aliases: ["p"],
	async execute(message, args) {
		if (!message.member?.voice.channel || !message.guild) return;

		const queue = message.client.player.createQueue(message.guild.id, {
			channel: message.channel as TextChannel,
		});
		await queue.join(message.member.voice.channel);

		const query = args.join(" ");
		queue.channel = message.channel as TextChannel;

		const youtube = new Client();

		try {
			const url = new URL(query);
			if (url.hostname.endsWith("youtube.com") && url.pathname === "/playlist") {
				const playlist = await queue
					.playlist(query, { requestedBy: message.author })
					.catch((err) => {
						message.channel.send("Something went wrong: " + err);
						queue.stop();
					});

				if (playlist) {
					const msg = "🎶 **Added ${playlist.songs.length} songs from ${playlist.name}**";
					await message.reply({ embeds: [getEmbedMessage(msg)] });
				}
			} else if (url.hostname.endsWith("youtu.be") || url.hostname.endsWith("youtube.com")) {
				let id: string | null;
				if (url.hostname.endsWith("youtu.be")) id = url.pathname.split("/")[1];
				else id = url.searchParams.get("v");
				if (!id) throw null;

				const video = await youtube.getVideo(id);
				if (!video) throw new Error("❌ **No video found**");

				const addedSong = new Song(
					{
						name: video.title,
						url: "https://www.youtube.com/watch?v=" + video.id,
						duration: Utils.msToTime(("duration" in video ? video.duration : 0) * 1000),
						author: video.channel.name,
						isLive: video instanceof LiveVideo,
						thumbnail: video.thumbnails.best,
					} as RawSong,
					queue,
					message.author
				);

				const song = await queue.play(addedSong, { requestedBy: message.author }).catch((err) => {
					message.channel.send("Something went wrong: " + err);
					queue.stop();
				});

				if (song && queue.songs.length >= 1) {
					const msg = `🎶 **Added ${song.name}**`;
					await message.reply({
						content: msg,
						embeds: [getEmbedFromSong(song)],
						allowedMentions: { repliedUser: false },
					});
				}
			}
		} catch (err) {
			const item = await youtube.findOne(query, { type: "video" });
			if (!item) throw new Error("❌ **No video found**");

			const addedSong = new Song(
				{
					name: item.title,
					url: "http://www.youtube.com/watch?v=" + item.id,
					duration: Utils.msToTime((item.duration || 0) * 1000),
					author: item.channel?.name,
					isLive: item.isLive,
					thumbnail: item.thumbnails.best,
				} as RawSong,
				queue,
				message.author
			);

			const song = await queue.play(addedSong, { requestedBy: message.author }).catch((err) => {
				message.channel.send("Something went wrong: " + err);
				queue.stop();
			});

			if (song && queue.songs.length >= 1) {
				const msg = `🎶 **Added ${song.name}**`;
				await message.reply({
					content: msg,
					embeds: [getEmbedFromSong(song)],
					allowedMentions: { repliedUser: false },
				});
			}
		}
	},
};

export default command;
