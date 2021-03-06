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

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isButton()) return;
	const commands = [...client.commands.values()];
	const customId = interaction.customId;
	const prefixId = interaction.customId.split("/").shift();

	const command = commands.find((command) => command.buttonInteractionIdPrefix === prefixId);
	if (!command?.buttonInteraction) return;

	try {
		await command.buttonInteraction(interaction);
	} catch (err) {
		await interaction.channel?.send(`Failed to execute the command : ${(err as Error).message}`);
	}
});

client.login(TOKEN);
