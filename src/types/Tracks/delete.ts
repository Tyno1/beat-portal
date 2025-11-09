import type { paths } from "../apiTypes";

export type DeleteTrackRequest =
	paths["/tracks/{track_id}"]["delete"]["parameters"]["path"];

export type DeleteTrackResponse =
	paths["/tracks/{track_id}"]["delete"]["responses"]["204"];

