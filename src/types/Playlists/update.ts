import type { paths } from "../apiTypes";

export type PutPlaylistRequest = {
	params: paths["/playlists/{playlist_id}"]["put"]["parameters"]["path"];
	body: paths["/playlists/{playlist_id}"]["put"]["requestBody"]["content"]["application/json"];
};

export type PutPlaylistResponse =
	paths["/playlists/{playlist_id}"]["put"]["responses"]["200"];

