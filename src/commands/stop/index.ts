import { Command } from "discord.js";

const command: Command = {
	name: "stop",
	description: "Stop playing song",
	aliases: ["dc", "disconnect", "leave"],
	async execute(message) {
		const queue = message.guild?.queue;
		if (!queue) return;

		if (message.member?.voice.channel?.id !== queue.voiceChannel?.id) {
			await message.reply("Join dlu baru request :smirk:");
			return;
		}

		queue.stop();

		await message.react("🛑");
		await message.react("👌🏻");
	},
};

export default command;
