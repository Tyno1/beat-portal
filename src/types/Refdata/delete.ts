import type { paths } from "../apiTypes";

export type DeleteRefdataResponse =
	paths["/refdata/{refdata_type}"]["delete"]["responses"]["200"]["content"]["application/json"];

export type DeleteRefdataPathParams =
	paths["/refdata/{refdata_type}"]["delete"]["parameters"]["path"];

