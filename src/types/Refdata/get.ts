import type { paths } from "../apiTypes";

export type GetRefdataResponse =
	paths["/refdata/{refdata_type}"]["get"]["responses"]["200"]["content"]["application/json"];

export type GetRefdataRequest =
	paths["/refdata/{refdata_type}"]["get"]["parameters"]["path"]["refdata_type"];
	