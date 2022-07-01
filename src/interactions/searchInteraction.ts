import { IInteraction, TextChannel } from "discord.js";
import { playSong } from "../utils/playSong";

const interaction: IInteraction = {
	buttonInteraction: {
		buttonInteractionIdPrefix: "search",
		async buttonInteraction(interaction) {
			const guild = interaction.client.guilds.cache.get(interaction.guildId!);
			const member = guild?.members.cache.get(interaction.member!.user.id);
			if (!(guild && member)) return;

			if (!member.voice.channel) return;

			const queue = interaction.client.player.createQueue(guild.id, {
				channel: interaction.channel as TextChannel,
			});
			if (!queue.voiceChannel) queue.setVoiceChannel(member.voice.channel);
			if (!queue.isPlaying) {
				await queue.join(member.voice.channel);
				queue.setVolume(200);
			}

			const videoId = interaction.customId.split("/").pop() as string;

			await playSong(videoId, queue, interaction.user, interaction, "id");
		},
	},
};

export default interaction;
