import type { paths } from "../apiTypes";

export type PostScanLibraryRequest = paths["/library/scan"]["post"]["requestBody"]["content"]["application/json"];

export type PostScanLibraryResponse = paths["/library/scan"]["post"]["responses"]["202"]["content"]["application/json"];