import { Command } from "discord.js";

const command: Command = {
	name: "stop",
	description: "Stop playing song",
	async execute(message) {
		const queue = message.guild?.queue;
		if (!queue) return;

		queue.stop();

		await message.react("🛑");
		await message.react("👌🏻");
	},
};

export default command;
