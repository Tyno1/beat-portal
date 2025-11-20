import type { paths } from "../types/apiTypes";
import { apiClient } from "./client";

export const getRefdata = async (
	refdataType: "trackfilters",
): Promise<
	paths["/refdata/{refdata_type}"]["get"]["responses"]["200"]["content"]["application/json"]
> => {
	const response = await apiClient.get<
		paths["/refdata/{refdata_type}"]["get"]["responses"]["200"]["content"]["application/json"]
	>(`/refdata/${refdataType}`);
	return response.data;
};

export const createRefdata = async (
	refdataType: "trackfilters",
	request: paths["/refdata/{refdata_type}"]["post"]["requestBody"]["content"]["application/json"],
): Promise<
	paths["/refdata/{refdata_type}"]["post"]["responses"]["201"]["content"]["application/json"]
> => {
	const response = await apiClient.post<
		paths["/refdata/{refdata_type}"]["post"]["responses"]["201"]["content"]["application/json"]
	>(`/refdata/${refdataType}`, request);
	return response.data;
};

export const deleteRefdata = async (
	refdataType: "trackfilters",
): Promise<
	paths["/refdata/{refdata_type}"]["delete"]["responses"]["200"]["content"]["application/json"]
> => {
	const response = await apiClient.delete<
		paths["/refdata/{refdata_type}"]["delete"]["responses"]["200"]["content"]["application/json"]
	>(`/refdata/${refdataType}`);
	return response.data;
};

const refdataApi = {
	getRefdata,
	createRefdata,
	deleteRefdata,
};

export default refdataApi;

