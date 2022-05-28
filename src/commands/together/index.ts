import { Command, MessageActionRow, MessageButton } from "discord.js";

const command: Command = {
	name: "together",
	description: "do something together",
	aliases: ["tg"],
	async execute(message, args) {
		const channel = message.member?.voice.channel;

		const appId = (args.shift() || "") as keyof typeof appsId;

		const appsId = {
			youtube: "880218394199220334",
			poker: "755827207812677713",
			betrayal: "773336526917861400",
			fishing: "814288819477020702",
			chess: "832012774040141894",
		};

		if (!channel) return message.reply("You must be in a voice channel!");
		if (!appsId[appId])
			return message.reply("Invalid app name, valid app name: " + Object.keys(appsId).join(", "));

		const invite = await channel.createInvite({
			targetApplication: appsId[appId],
			targetType: 2,
			maxUses: 0,
		});

		const row = new MessageActionRow({
			components: [
				new MessageButton({
					label: `JOIN ${appId.toUpperCase()}`,
					style: "LINK",
					url: invite.url,
				}),
			],
		});

		message.channel.send({
			content: `**<@!${message.author.id}> has started an activity!** (${appId.toUpperCase()})`,
			components: [row],
		});
	},
};

export default command;
