import { Download, Upload } from "lucide-react";
import { Button } from "../../../atoms";

export default function LibraryHeader() {
  return (
    <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
      <h1 className="text-2xl font-bold text-foreground">Library</h1>
      <div className="flex gap-3">
        <Button
          variant="solid"
          color="secondary"
          iconBefore={<Download />}
          size="sm"
        >
          Import Music
        </Button>
        <Button
          variant="solid"
          color="primary"
          iconBefore={<Upload />}
          size="sm"
        >
          Export Playlist
        </Button>
      </div>
    </div>
  );
}

