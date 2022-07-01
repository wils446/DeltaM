import { ICommand, Message } from "discord.js";

class OnMessageHandler {
	constructor(private commands: ICommand[], private prefix: string) {}

	async execute(message: Message) {
		if (message.author.bot || !message.cleanContent.startsWith(this.prefix)) return;

		const args = message.cleanContent.slice(this.prefix.length).split(/ +/);
		const commandName = (args.shift() as string).toLowerCase();

		const command = this.commands.find((cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName));
		if (!command || !message.guild) return;

		try {
			const queue = message.client.player.getQueue(message.guild.id);
			message.guild.queue = queue;

			await command.execute(message, args);
		} catch (err) {
			await message.reply(`Failed to execute the command : ${(err as Error).message}`);
		}
	}
}

export default OnMessageHandler;
