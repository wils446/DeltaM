import { ICommand, MessageEmbed } from "discord.js";
import { getCommits } from "../modules/octokit/getCommits";

const command: ICommand = {
	name: "update",
	description: "get the latest update of the bot",
	async execute(message, args) {
		const commits = await getCommits("Development");

		const embed = new MessageEmbed({
			title: "Update",
			description: "Latest Commit on Github",
			fields: commits.map((commit) => {
				return {
					name: commit.commit.message,
					value: `[commit by ${commit.commit.committer.name} at ${new Date(commit.commit.committer.date)
						.toLocaleString()
						.split(",")
						.shift()}\](${commit.html_url})`,
				};
			}),
			color: "GREEN",
		});

		await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	},
};

export default command;
3;
