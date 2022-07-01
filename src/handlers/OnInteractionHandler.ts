import { IInteraction, Interaction } from "discord.js";

class OnInteractionHandler {
	constructor(private interactionCommands: IInteraction[]) {}

	async execute(interaction: Interaction) {
		if (!interaction.isButton()) return;

		const customId = interaction.customId;
		const prefix = customId.split("/").shift() as string;

		const command = this.interactionCommands.find((cmd) => cmd.buttonInteraction?.buttonInteractionIdPrefix === prefix);

		if (!command) return;

		await command.buttonInteraction?.buttonInteraction(interaction);
	}
}

export default OnInteractionHandler;
