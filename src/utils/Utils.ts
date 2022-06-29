import { RawSong, RepeatMode, Song, Utils as DMPUtils } from "discord-music-player";
import { ButtonInteraction, Message, MessageEmbed, User } from "discord.js";
import { Client, LiveVideo } from "youtubei";
import Queue from "../modules/Queue";

class Utils {
	static getEmbedFromSong(song: Song, changeSongMessage = false, progressBar?: string): MessageEmbed {
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
	}

	static getEmbedMessage(message: string) {
		return new MessageEmbed({
			description: message,
			color: "GREEN",
		});
	}
}

export default Utils;
