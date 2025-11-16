import type { GetHealthResponse } from "../types/System";
import { apiClient } from "./client";

export const getHealth = async (): Promise<GetHealthResponse> => {
	const response = await apiClient.get<GetHealthResponse>("/health");
	return response.data;
};

const systemApi = {
	getHealth,
};

export default systemApi;

