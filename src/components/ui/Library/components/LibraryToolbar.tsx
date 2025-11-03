import { Filter, Grid3x3, List, Search } from "lucide-react";
import { Button, IconButton, Input } from "../../../atoms";

export default function LibraryToolbar() {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex gap-3">
        <Input
          placeholder="Search Tracks, year, artists or genre..."
          leftIcon={<Search />}
          containerClassName="flex-1 rounded-full"
          variant="alt"
          size="lg"

        />
        <Button variant="solid" color="secondary" iconBefore={<Filter size={16} />}>
          Filters
        </Button>
        <div className="flex gap-2">
          <IconButton
            icon={<Grid3x3 size={20} />}
            aria-label="Grid view"
            color="primary"
            variant="solid"
          />
          <IconButton
            icon={<List size={20} />}
            aria-label="List view"
            color="secondary"
            variant="solid"
          />
        </div>
      </div>
    </div>
  );
}
