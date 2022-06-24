import { Command, MessageEmbed, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import type { IButtonInteractionMeta } from "./interface";
import { Client, LiveVideo } from "youtubei";
import { RawSong, Song, Utils } from "discord-music-player";
import { getEmbedFromSong } from "../../utils/Utils";

const command: Command<IButtonInteractionMeta> = {
	name: "search",
	description: "to search songs",
	buttonInteractionIdPrefix: "search",
	async execute(message, args) {
		if (args.length === 0) {
			await message.reply("insert the title of the song");
			return;
		}

		const youtube = new Client();

		const query = args.join(" ");

		const rawResult = await youtube.search(query, { type: "video" });
		const result = rawResult.slice(0, 10);

		const embed = new MessageEmbed({
			title: "Search results",
			fields: result.map((video, index) => ({
				name: `${index + 1}. ${video.title}`,
				value: `https://www.youtube.com/watch?v=${video.id}`,
			})),
		});

		const buttons = result.map((video, index) =>
			new MessageButton()
				.setLabel(`${index + 1}. ${video.title}`)
				.setStyle("SUCCESS")
				.setCustomId(`${this.buttonInteractionIdPrefix}/${video.id}`)
		);

		const rows = [
			new MessageActionRow({ components: buttons.slice(0, 5) }),
			new MessageActionRow({ components: buttons.slice(5) }),
		];

		message.reply({
			embeds: [embed],
			allowedMentions: { repliedUser: false },
			components: [...rows],
		});
	},
	async buttonInteraction(interaction) {
		const guild = interaction.client.guilds.cache.get(interaction.guildId!);
		const member = guild?.members.cache.get(interaction.member!.user.id);
		if (!(guild && member)) return;

		if (!member.voice.channel) return;

		const queue = interaction.client.player.createQueue(guild.id, {
			channel: interaction.channel as TextChannel,
		});
		if (!queue.voiceChannel) queue.setVoiceChannel(member.voice.channel);
		if (!queue.isPlaying) {
			await queue.join(member.voice.channel);
			queue.setVolume(200);
		}

		const youtube = new Client();
		const videoId = interaction.customId.split("/").pop() as string;

		const video = await youtube.getVideo(videoId);
		if (!video) throw new Error("❌ **No video found**");

		const addedSong = new Song(
			{
				name: video.title,
				url: "https://www.youtube.com/watch?v=" + videoId,
				duration: Utils.msToTime(("duration" in video ? video.duration : 0) * 1000),
				author: video.channel.name,
				isLive: video instanceof LiveVideo,
				thumbnail: video.thumbnails.best,
			} as RawSong,
			queue,
			interaction.user
		);

		const song = await queue.play(addedSong, { requestedBy: interaction.user }).catch((err) => {
			interaction.channel?.send("Something went wrong: " + err);
			queue.stop();
		});

		if (song && queue.songs.length >= 1) {
			const msg = `🎶 **Added ${song.name}**`;
			await interaction.reply({
				content: msg,
				embeds: [getEmbedFromSong(song)],
				allowedMentions: { repliedUser: false },
			});
		}
	},
};

export default command;
