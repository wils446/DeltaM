import { IInteraction, MessageEmbed } from "discord.js";

const Interaction: IInteraction = {
	buttonInteraction: {
		buttonInteractionIdPrefix: "queue",
		async buttonInteraction(interaction) {
			const queue = interaction.guild?.queue;
			if (!queue) return;

			const action = interaction.customId.split("/").pop() as "next" | "prev";
			const interactionMessageDescription = interaction.message.embeds[0].description as string;
			let [page, maxPage] = interactionMessageDescription
				.split(" ")
				.filter((str) => str.includes("**"))
				.map((str) => +str.substring(2, 3));

			page--;

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
		},
	},
};

export default Interaction;
