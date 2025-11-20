import type { paths } from "../apiTypes";

export type DeleteTracksFromPlaylistRequest = {
	params: paths["/playlists/{playlist_id}/tracks"]["delete"]["parameters"]["path"];
	body: paths["/playlists/{playlist_id}/tracks"]["delete"]["requestBody"]["content"]["application/json"];
};

export type DeleteTracksFromPlaylistResponse =
	paths["/playlists/{playlist_id}/tracks"]["delete"]["responses"]["200"];