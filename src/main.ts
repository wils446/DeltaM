import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });

const PREFIX = process.env.PREFIX as string;
const TOKEN = process.env.TOKEN as string;

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

client.commands = [];

const commandFiles = fs.readdirSync("./src/commands");
for (const file of commandFiles) {
	const { default: command } = require(`./commands/${file}`);
	client.commands.push(command);
}

client.once("ready", () => {
	console.log("Ready!");
});

client.on("messageCreate", async (message) => {
	if (message.author.bot || !message.cleanContent.startsWith(PREFIX)) return;

	const args = message.cleanContent.slice(PREFIX.length).split(/ +/);
	const commandName = (args.shift() as string).toLowerCase();

	const command = client.commands.find((cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName));
	if (!command || !message.guild) return;

	try {
		const queue = client.player.getQueue(message.guild.id);
		message.guild.queue = queue;

		await command.execute(message, args);
	} catch (err) {
		await message.reply(`Failed to executethe command : ${(err as Error).message}`);
	}
});

client.login(TOKEN);
