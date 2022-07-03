import { RawSong } from "discord-music-player";
import { IUserHistory } from "../data/IUserHistory";
import fs from "fs";

export const updateUserHistory = async (userId: string, rawSong: RawSong) => {
	const { default: history }: { default: IUserHistory } = await import("../data/userHistory.json");
	console.log(rawSong.url.split("://").shift());

	let { url } = rawSong;
	if (url.startsWith("http://www.")) {
		url = `https://${url.slice(11)}`;
	}
	console.log(url);

	let user = history.users.find((user) => user.id === userId);
	if (!user) {
		user = {
			id: userId,
			playedSongs: [],
		};
		history.users.push(user);
	}

	let songData = user.playedSongs.find((song) => song.song.url === url);
	if (!songData) {
		songData = {
			song: rawSong,
			playCount: 0,
		};
		songData.song.url = url;
		user.playedSongs.push(songData);
	}

	await history.users.forEach((user) => {
		if (user.id !== userId) return;
		user.playedSongs.forEach((song) => {
			if (song.song.url !== url) return;
			song.playCount++;
		});
	});

	await fs.writeFileSync("./src/data/userHistory.json", JSON.stringify(history, null, 2));
};
