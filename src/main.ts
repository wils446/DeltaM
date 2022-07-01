import { Client, ICommand, IInteraction, Intents } from "discord.js";
import dotenv from "dotenv";
import Player from "./modules/Player";
import { OnMessageHandler, OnInteractionHandler } from "./handlers";
import { getCommands } from "./utils/getCommands";

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
client.interactionCommands = [];
client.player = new Player(client, {
	leaveOnEnd: false,
	leaveOnEmpty: false,
	leaveOnStop: true,
	deafenOnJoin: true,
});

client.commands = getCommands("message") as ICommand[];
client.interactionCommands = getCommands("interaction") as IInteraction[];

client.once("ready", () => {
	console.log("Ready!");
	client.user?.setActivity("to the moon", { type: "LISTENING" });
});

const onMessageHandler = new OnMessageHandler(client.commands, PREFIX);
const onInteractionHandler = new OnInteractionHandler(client.interactionCommands);

client.on("messageCreate", async (message) => onMessageHandler.execute(message));
client.on("interactionCreate", async (interaction) => onInteractionHandler.execute(interaction));

client.login(TOKEN);
