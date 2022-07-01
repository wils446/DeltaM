import Queue from "../modules/Queue";
import "discord.js";
import Player from "../modules/Player";

declare module "discord.js" {
	export interface Client {
		commands: ICommand[];
		interactionCommands: IInteraction[];
		player: Player;
	}

	export interface Guild {
		queue?: Queue;
	}

	export interface ICommand {
		name: string;
		description: string;
		aliases?: string[];
		buttonInteractionIdPrefix?: string;
		execute: (message: Message, args: string[]) => Promise<unknown>;
	}

	export interface IInteraction {
		buttonInteraction?: IButtonInteraction;
		slashCommandInteraction?: ISlashCommandInteraction;
	}

	export interface IButtonInteraction {
		buttonInteractionIdPrefix?: string;
		buttonInteraction: (interaction: ButtonInteraction) => promise<unknown>;
	}

	export interface ISlashCommandInteraction {}
}
