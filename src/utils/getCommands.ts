import { ICommand, IInteraction } from "discord.js";
import fs from "fs";

export const getCommands = (commandType: "message" | "interaction"): ICommand[] | IInteraction[] => {
	const path = commandType === "message" ? "./dist/commands" : "./dist/interactions";
	const commands = [];

	const files = fs.readdirSync(path);
	for (const file of files) {
		const { default: command } = require(`.${path.replace("/dist", "")}/${file}`);
		commands.push(command);
	}

	return commands;
};
