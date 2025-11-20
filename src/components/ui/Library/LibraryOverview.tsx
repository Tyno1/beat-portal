import { useLibraryOverview } from "../../../hooks";
import { Card, CardContent } from "../../molecules";

function formatDuration(seconds: number | undefined): string {
  if (!seconds || seconds === 0) return "0s";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

function formatFileSize(bytes: number | undefined): string {
  if (!bytes || bytes === 0) return "0 B";
  
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return "0";
  return num.toLocaleString();
}

export default function LibraryOverview() {
  const { data: libraryOverviewData, isLoading } = useLibraryOverview();
  
  if (isLoading) {
    return (
      <Card
        size="xs"
        className="bg-background"
        variant="flat"
        header={{ title: "Library Stats" }}
      >
        <CardContent className="text-xs text-muted-foreground">
          <p>Loading statistics...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!libraryOverviewData) {
    return (
      <Card
        size="xs"
        className="bg-background"
        variant="flat"
        header={{ title: "Library Stats" }}
      >
        <CardContent className="text-xs text-muted-foreground">
          <p>No library data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card
      size="xs"
      className="bg-background"
      variant="flat"
      header={{ title: "Library Stats" }}
    >
      <CardContent className="text-xs text-muted-foreground space-y-1">
        <p>
          <span className="font-semibold text-foreground">Tracks:</span>{" "}
          {formatNumber(libraryOverviewData.total_tracks)}
        </p>
        <p>
          <span className="font-semibold text-foreground">Duration:</span>{" "}
          {formatDuration(libraryOverviewData.total_duration_seconds)}
        </p>
        <p>
          <span className="font-semibold text-foreground">Size:</span>{" "}
          {formatFileSize(libraryOverviewData.total_size_bytes)}
        </p>
        <p>
          <span className="font-semibold text-foreground">Genres:</span>{" "}
          {formatNumber(libraryOverviewData.total_genres)}
        </p>
      </CardContent>
    </Card>
  );
}
