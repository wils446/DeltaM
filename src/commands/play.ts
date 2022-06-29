import { ICommand, TextChannel } from "discord.js";
import { playSong } from "../utils/playSong";

const command: ICommand = {
	name: "play",
	description: "Play a Song",
	aliases: ["p"],
	async execute(message, args) {
		if (!message.member?.voice.channel || !message.guild) return;

		const queue = message.client.player.createQueue(message.guild.id, {
			channel: message.channel as TextChannel,
		});
		if (!queue.voiceChannel) await queue.setVoiceChannel(message.member.voice.channel);
		if (!queue.isPlaying) {
			await queue.join(message.member.voice.channel);
			queue.setVolume(200);
		}

		const query = args.join(" ");
		queue.channel = message.channel as TextChannel;

		if (message.member.voice.channel.id !== queue.voiceChannel?.id) {
			await message.reply("Join dlu baru request :smirk:");
			return;
		}

		await playSong(query, queue, message.author, message, "string");
	},
};

export default command;
