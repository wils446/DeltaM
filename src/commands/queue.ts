import { ICommand, MessageButton, MessageEmbed, MessageActionRow } from "discord.js";

const command: ICommand = {
	name: "queue",
	description: "Show current queue",
	aliases: ["q"],
	buttonInteractionIdPrefix: "queue",
	async execute(message, args) {
		const queue = message.guild?.queue;
		if (!queue) return;

		const page = +(args.shift() || 1) - 1;
		const perPage = 10;

		const start = page * perPage;
		const end = (page + 1) * perPage;

		const paginatedQueue = queue.songs.slice(start, end);

		const embed = new MessageEmbed({
			title: "Queue",
			description: `Showing page **${page + 1}** / **${Math.ceil(queue.songs.length / perPage)}**`,
			fields: paginatedQueue.map((song, index) => ({
				name: `${start + index + 1}. ${song.name}`,
				value: `${song.url}\r\nRequested by <@!${song.requestedBy?.id}>`,
			})),
			color: "GREEN",
			footer: { text: `use \` ${process.env.PREFIX}queue <page> \` to change page` },
		});

		const buttons = [
			new MessageButton().setEmoji("⏮").setStyle("PRIMARY").setCustomId(`${this.buttonInteractionIdPrefix}/prev`),
			new MessageButton().setEmoji("⏭").setStyle("PRIMARY").setCustomId(`${this.buttonInteractionIdPrefix}/next`),
		];

		const row = new MessageActionRow({
			components: [...buttons],
		});

		message.reply({
			embeds: [embed],
			allowedMentions: { repliedUser: false },
			components: [row],
		});
	},
};

export default command;
