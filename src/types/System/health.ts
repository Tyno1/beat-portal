import type { paths } from "../apiTypes";

export type GetHealthResponse =
	paths["/health"]["get"]["responses"]["200"]["content"]["application/json"];

