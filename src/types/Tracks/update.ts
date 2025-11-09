import type { paths } from "../apiTypes";

export type PutTrackRequest = {
	params: paths["/tracks/{track_id}"]["put"]["parameters"]["path"];
	body: paths["/tracks/{track_id}"]["put"]["requestBody"]["content"]["application/json"];
};

export type PutTrackResponse =
	paths["/tracks/{track_id}"]["put"]["responses"]["200"]["content"]["application/json"];

