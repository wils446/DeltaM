import {
	ButtonInteraction,
	Command,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from "discord.js";

const command: Command = {
	name: "queue",
	description: "Show current queue",
	aliases: ["q"],
	buttonInteractionIdPrefix: "queue",
	buttonInteractionIdArgs: [],
	async execute(message, args) {
		const queue = message.guild?.queue;
		if (!queue) return;

		const page = +(args.shift() || 1) - 1;
		const perPage = 10;

		const start = page * perPage;
		const end = (page + 1) * perPage;

		this.buttonInteractionIdArgs = ["" + page];

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
			new MessageButton()
				.setEmoji("⏮")
				.setStyle("PRIMARY")
				.setCustomId(`${this.buttonInteractionIdPrefix}/prev`),
			new MessageButton()
				.setEmoji("⏭")
				.setStyle("PRIMARY")
				.setCustomId(`${this.buttonInteractionIdPrefix}/next`),
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
	async buttonInteraction(interaction: ButtonInteraction) {
		//code
		const queue = interaction.guild?.queue;
		if (!queue) return;

		const action = interaction.customId.split("/").pop() as "next" | "prev";
		let page = +this.buttonInteractionIdArgs![0];
		const maxPage = Math.ceil(queue.songs.length / 10);

		if (action === "next") page++;
		if (action === "prev") if (page !== 0) page--;

		if (page >= maxPage) page %= maxPage;

		const start = page * 10;
		const end = (page + 1) * 10;

		const paginatedQueue = queue?.songs.slice(start, end);

		const embed = new MessageEmbed({
			title: "Queue",
			description: `Showing page **${page + 1}** / **${maxPage}**`,
			fields: paginatedQueue.map((song, index) => ({
				name: `${start + index + 1}. ${song.name}`,
				value: `${song.url}\r\nRequested by <@!${song.requestedBy?.id}>`,
			})),
			color: "GREEN",
		});

		await interaction.update({ embeds: [embed] });
		this.buttonInteractionIdArgs![0] = "" + page;
	},
};

export default command;
