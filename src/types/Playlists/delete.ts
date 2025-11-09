import type { paths } from "../apiTypes";

export type DeletePlaylistRequest =
	paths["/playlists/{playlist_id}"]["delete"]["parameters"]["path"];

export type DeletePlaylistResponse =
	paths["/playlists/{playlist_id}"]["delete"]["responses"]["204"];

