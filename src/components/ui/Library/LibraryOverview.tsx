import { useLibraryOverview } from "../../../hooks";
import { Card, CardContent } from "../../molecules";

export default function LibraryOverview() {
  const { data: libraryOverviewData, isLoading } = useLibraryOverview();
  if (isLoading) return <div>Loading...</div>;
  if (!libraryOverviewData) return <div>No data</div>;
  return (
    <Card
      size="xs"
      className="bg-background"
      variant="flat"
      header={{ title: "Library Stats" }}
    >
      <CardContent className="text-xs text-muted-foreground">
        <p>Total Tracks: {libraryOverviewData.total_tracks}</p>
        <p>Total Duration: {libraryOverviewData.total_duration_seconds}s</p>
        <p>Total Size: {libraryOverviewData.total_size_bytes} bytes</p>
        <p>Genres: {libraryOverviewData.total_genres}</p>
      </CardContent>
    </Card>
  );
}
