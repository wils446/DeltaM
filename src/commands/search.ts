import { ICommand, MessageEmbed, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import { Client } from "youtubei";

const command: ICommand = {
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
};

export default command;
