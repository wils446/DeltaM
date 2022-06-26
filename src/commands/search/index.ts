import { Command, MessageEmbed, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import { Client } from "youtubei";
import { playSong } from "../../utils/Utils";

const command: Command = {
	name: "search",
	description: "to search songs",
	buttonInteractionIdPrefix: "search",
	async execute(message, args) {
		if (args.length === 0) {
			await message.reply("insert the title of the song");
			return;
		}

		const youtube = new Client();

		const query = args.join(" ");

		const rawResult = await youtube.search(query, { type: "video" });
		const result = rawResult.slice(0, 10);

		const embed = new MessageEmbed({
			title: "Search results",
			fields: result.map((video, index) => ({
				name: `${index + 1}. ${video.title}`,
				value: `https://www.youtube.com/watch?v=${video.id}`,
			})),
		});

		const buttons = result.map((video, index) =>
			new MessageButton()
				.setLabel(`${index + 1}. ${video.title.substring(0, 30)}...`)
				.setStyle("SUCCESS")
				.setCustomId(`${this.buttonInteractionIdPrefix}/${video.id}`)
		);

		const rows = [
			new MessageActionRow({ components: buttons.slice(0, 5) }),
			new MessageActionRow({ components: buttons.slice(5) }),
		];

		message.reply({
			embeds: [embed],
			allowedMentions: { repliedUser: false },
			components: [...rows],
		});
	},
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
};

export default command;
