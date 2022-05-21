import { RepeatMode, Song } from "discord-music-player";
import { MessageEmbed } from "discord.js";

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
