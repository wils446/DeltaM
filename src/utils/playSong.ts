import { RawSong, Song, Utils as DMPUtils } from "discord-music-player";
import { ButtonInteraction, Message, User } from "discord.js";
import { Client, LiveVideo } from "youtubei";
import Utils from "./Utils";
import Queue from "../modules/Queue";
import { updateUserHistory } from "./updateUserHistory";

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
				duration: DMPUtils.msToTime(("duration" in video ? video.duration : 0) * 1000),
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
			await updateUserHistory(user.id, addedSong);
			const msg = `🎶 **Added ${song.name}**`;
			await message.reply({
				content: msg,
				embeds: [Utils.getEmbedFromSong(song)],
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
					await Promise.all([
						...playlist.songs.map(
							async (song) =>
								await updateUserHistory(user.id, {
									name: song.name,
									url: song.url,
									duration: song.duration,
									author: song.author,
									isLive: song.isLive,
									thumbnail: song.thumbnail,
								})
						),
					]);
					const msg = `🎶 **Added ${playlist.songs.length} songs from ${playlist.name}**`;
					await message.reply({
						embeds: [Utils.getEmbedMessage(msg)],
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

				const rawSong = {
					name: video.title,
					url: "https://www.youtube.com/watch?v=" + video.id,
					duration: DMPUtils.msToTime(("duration" in video ? video.duration : 0) * 1000),
					author: video.channel.name,
					isLive: video instanceof LiveVideo,
					thumbnail: video.thumbnails.best,
				} as RawSong;

				const addedSong = new Song(rawSong, queue, user);

				const song = await queue.play(addedSong, { requestedBy: user }).catch((err) => {
					message.channel?.send("Something went wrong: " + err);
					queue.stop();
				});

				if (song && queue.songs.length >= 1) {
					await updateUserHistory(user.id, rawSong);
					const msg = `🎶 **Added ${song.name}**`;
					await message.reply({
						content: msg,
						embeds: [Utils.getEmbedFromSong(song)],
						allowedMentions: { repliedUser: false },
					});
				}
			} else if (url.hostname.endsWith("spotify.com") && url.pathname.startsWith("/playlist")) {
				const playlist = await queue.playlist(query, { requestedBy: user }).catch((err) => {
					message.channel?.send("Something went wrong: " + err);
					queue.stop();
				});

				if (playlist) {
					await Promise.all([
						...playlist.songs.map(
							async (song) =>
								await updateUserHistory(user.id, {
									name: song.name,
									url: song.url,
									duration: song.duration,
									author: song.author,
									isLive: song.isLive,
									thumbnail: song.thumbnail,
								})
						),
					]);
					const msg = `🎶 **Added ${playlist.songs.length} songs from ${playlist.name}**`;
					await message.reply({
						embeds: [Utils.getEmbedMessage(msg)],
						allowedMentions: { repliedUser: false },
					});
				}
			}
		} catch (err) {
			const item = await youtube.findOne(query, { type: "video" });
			if (!item) throw new Error("❌ **No video found**");

			const rawSong: RawSong = {
				name: item.title,
				url: "http://www.youtube.com/watch?v=" + item.id,
				duration: DMPUtils.msToTime((item.duration || 0) * 1000),
				author: item.channel!.name,
				isLive: item.isLive,
				thumbnail: item.thumbnails.best,
			} as RawSong;

			const addedSong = new Song(rawSong, queue, user);

			const song = await queue.play(addedSong, { requestedBy: user }).catch((err) => {
				message.channel?.send("Something went wrong: " + err);
				queue.stop();
			});

			if (song && queue.songs.length >= 1) {
				await updateUserHistory(user.id, rawSong);
				const msg = `🎶 **Added ${song.name}**`;
				await message.reply({
					content: msg,
					embeds: [Utils.getEmbedFromSong(song)],
					allowedMentions: { repliedUser: false },
				});
			}
		}
	}
};
