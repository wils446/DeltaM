import { RawSong } from "discord-music-player";

export interface IUserHistory {
	users: User[];
}

export interface User {
	id: string;
	playedSongs: Song[];
}

export interface Song {
	song: RawSong;
	playCount: number;
}
