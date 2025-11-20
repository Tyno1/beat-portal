import type { paths } from "../../apiTypes";

export type PostTrackMetadataResetRequest = NonNullable<
  paths["/tracks/{track_id}/reset-metadata"]["post"]["requestBody"]
>["content"]["application/json"];

export type PostTrackMetadataResetResponse =
  paths["/tracks/{track_id}/reset-metadata"]["post"]["responses"]["200"]["content"]["application/json"];
