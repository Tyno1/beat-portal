import { Download, Upload } from "lucide-react";
import { Button } from "../../atoms";

export default function LibraryHeader() {
  return (
    <div className="flex justify-between items-center border-b border-border pb-4">
      <h1 className="text-2xl font-bold text-foreground">Library</h1>
      <div className="flex gap-3">
        <Button
          variant="solid"
          color="secondary"
          iconBefore={<Download size={16} />}
          size="sm"
        >
          Import Music
        </Button>
        <Button
          variant="solid"
          color="primary"
          iconBefore={<Upload size={16} />}
          size="sm"
        >
          Export Playlist
        </Button>
      </div>
    </div>
  );
}

