import { Download, Plus } from "lucide-react";
import { Button } from "../../atoms";

interface LibraryHeaderProps {
	onCreatePlaylist?: () => void;
}

export default function LibraryHeader({ onCreatePlaylist }: LibraryHeaderProps) {
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
          iconBefore={<Plus size={16} />}
          size="sm"
          onClick={onCreatePlaylist}
        >
          Create Playlist
        </Button>
      </div>
    </div>
  );
}

