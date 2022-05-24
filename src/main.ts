import { Client, Intents } from "discord.js";
import fs from "fs";
import dotenv from "dotenv";
import Player from "./modules/Player";

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

const player = new Player(client, {
	leaveOnEnd: false,
	leaveOnEmpty: false,
	leaveOnStop: true,
	deafenOnJoin: true,
	timeout: 5000,
});

client.commands = [];
client.player = player;

const commandFolders = fs.readdirSync("./dist/src/commands");
for (const folder of commandFolders) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { default: command } = require(`./commands/${folder}/index.js`);
	client.commands.push(command);
}

client.once("ready", () => {
	client.user?.setActivity("to the moon", { type: "LISTENING" });
	console.log("Ready!!");
});

client.on("messageCreate", async (message) => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;
	if (message.author.id !== "330231306137108480") {
		await message.reply("bot are in development, use another bot fakyu 😎👍");
		return;
	}

	const args = message.content.slice(PREFIX.length).split(/ +/);
	const commandName = (args.shift() as string).toLowerCase();

	const command = client.commands.find(
		(cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName)
	);

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
