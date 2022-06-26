import { RawSong, RepeatMode, Song, Utils } from "discord-music-player";
import { ButtonInteraction, Message, MessageEmbed, User } from "discord.js";
import { Client, LiveVideo } from "youtubei";
import Queue from "../modules/Queue";

export const getEmbedFromSong = (
	song: Song,
	changeSongMessage = false,
	progressBar?: string
): MessageEmbed => {
	const fields = [{ name: "Duration", value: song.duration }];
	if (progressBar) fields.unshift({ name: "Length", value: progressBar });

	const descriptions: string[] = [];
	if (song.author) descriptions.push(`**${song.author}**`);
	if (song.requestedBy) descriptions.push(`Requested by <@!${song.requestedBy.id}>`);

	return new MessageEmbed({
		author: { name: changeSongMessage ? "Now Playing" : "" },
		title: song.name,
		description: descriptions.join("\r\n"),
		url: song.url,
		thumbnail: { url: song.thumbnail },
		fields,
		color: "GREEN",
	});
};

export const getEmbedMessage = (message: string) => {
	return new MessageEmbed({
		description: message,
		color: "GREEN",
	});
};

export const getRepeatStateMessage = (state: RepeatMode): string => {
	if (state === RepeatMode.SONG) return "🔂 **Looping Song**";
	if (state === RepeatMode.QUEUE) return "🔁 **Looping Queue**";
	return "**Loop disabled**";
};

export const playSong = async (
	query: string,
	queue: Queue,
	user: User,
	message: ButtonInteraction | Message,
	queryType: "id" | "string"
) => {
	//code
	const youtube = new Client();

	if (queryType === "id") {
		const video = await youtube.getVideo(query);
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
			user
		);

		const song = await queue.play(addedSong, { requestedBy: user }).catch((err) => {
			message.channel?.send("Something went wrong: " + err);
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
	} else {
		try {
			const url = new URL(query);
			if (url.hostname.endsWith("youtube.com") && url.pathname === "/playlist") {
				const playlist = await queue.playlist(query, { requestedBy: user }).catch((err) => {
					message.channel?.send("Something went wrong: " + err);
					queue.stop();
				});

				if (playlist) {
					const msg = `🎶 **Added ${playlist.songs.length} songs from ${playlist.name}**`;
					await message.reply({
						embeds: [getEmbedMessage(msg)],
						allowedMentions: { repliedUser: false },
					});
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
					user
				);

				const song = await queue.play(addedSong, { requestedBy: user }).catch((err) => {
					message.channel?.send("Something went wrong: " + err);
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
			} else if (url.hostname.endsWith("spotify.com") && url.pathname.startsWith("/playlist")) {
				const playlist = await queue.playlist(query, { requestedBy: user }).catch((err) => {
					message.channel?.send("Something went wrong: " + err);
					queue.stop();
				});

				if (playlist) {
					const msg = `🎶 **Added ${playlist.songs.length} songs from ${playlist.name}**`;
					await message.reply({
						embeds: [getEmbedMessage(msg)],
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
				user
			);

			const song = await queue.play(addedSong, { requestedBy: user }).catch((err) => {
				message.channel?.send("Something went wrong: " + err);
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
	}
};
