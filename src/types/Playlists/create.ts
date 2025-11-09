import type { paths } from "../apiTypes";

export type PostPlaylistRequest =
	paths["/playlists"]["post"]["requestBody"]["content"]["application/json"];

export type PostPlaylistResponse =
	paths["/playlists"]["post"]["responses"]["201"]["content"]["application/json"];

