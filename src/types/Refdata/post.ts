import type { paths } from "../apiTypes";

export type PostRefdataResponse =
	paths["/refdata/{refdata_type}"]["post"]["responses"]["201"]["content"]["application/json"];

export type PostRefdataRequest =
	paths["/refdata/{refdata_type}"]["post"]["requestBody"]["content"]["application/json"];

export type PostRefdataPathParams =
	paths["/refdata/{refdata_type}"]["post"]["parameters"]["path"];

