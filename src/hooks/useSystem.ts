import { useQuery } from "@tanstack/react-query";
import { system } from "../apiClient";
import type { GetHealthResponse } from "../types/System";

export function useHealth() {
	return useQuery<GetHealthResponse>({
		queryKey: ["health"],
		queryFn: () => system.getHealth(),
	});
}

