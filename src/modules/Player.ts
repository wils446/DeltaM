import { Player as DefaultPlayer, PlayerOptions } from "discord-music-player";
import { Client as DiscordClient, Collection, Snowflake, TextChannel } from "discord.js";
import Utils from "../utils/Utils";
import Queue from "./Queue";

class Player extends DefaultPlayer {
	public queues: Collection<Snowflake, Queue> = new Collection();

	constructor(client: DiscordClient, options?: PlayerOptions) {
		super(client, options);

		this.on("songFirst", async (queue, song) => {
			const q = queue as Queue;

			if (q.destroyed || !q.channel) return;

			const channel = q.channel;
			q.message = await channel.send({ embeds: [Utils.getEmbedFromSong(song, true)] });
		});

		this.on("songChanged", async (queue, newSong) => {
			const q = queue as Queue;

			if (q.destroyed || !q.channel) return;

			const channel = q.channel;
			q.message = await channel.send({ embeds: [Utils.getEmbedFromSong(newSong, true)] });
		});
	}

	createQueue(guildId: Snowflake, options: PlayerOptions & { channel?: TextChannel } = this.options): Queue {
		options = Object.assign({} as PlayerOptions, this.options, options);

		const guild = this.client.guilds.resolve(guildId);
		if (!guild || !options.channel) throw new Error("Guild / Chanenl not found");
		if (this.hasQueue(guildId)) return this.getQueue(guildId) as Queue;

		const { channel } = options;
		delete options.channel;
		const queue = new Queue(channel, this, guild, options);
		this.setQueue(guildId, queue);

		return queue;
	}

	getQueue(guildId: Snowflake): Queue | undefined {
		return this.queues.get(guildId);
	}
}

export default Player;
