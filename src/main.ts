import { Client, Intents } from "discord.js";
import dotenv from "dotenv";

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

client.once("ready", () => {
	console.log("Ready!");
});

client.on("messageCreate", async (msg) => {});

client.login(TOKEN);
