import type { paths } from "../apiTypes";

export type GetEnhancementJobStatusRequest =
	paths["/ai/jobs/{job_id}"]["get"]["parameters"]["path"];

export type GetEnhancementJobStatusResponse =
	paths["/ai/jobs/{job_id}"]["get"]["responses"]["200"]["content"]["application/json"];

