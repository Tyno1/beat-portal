import { Filter, Grid3x3, List, Search } from "lucide-react";
import { useState } from "react";
import { Button, IconButton, Input } from "../../../atoms";
import { Popover } from "../../../molecules";

export type ViewMode = "table" | "grid";

interface LibraryToolbarProps {
	viewMode: ViewMode;
	onViewChange: (view: ViewMode) => void;
}

export default function LibraryToolbar({
	viewMode,
	onViewChange,
}: LibraryToolbarProps) {

	return (
		<div className="space-y-3 mb-4 px-2">
			<div className="flex gap-3 items-center">
				<Input
					placeholder="Search Tracks, year, artists or genre..."
					leftIcon={<Search />}
					containerClassName="flex-1 rounded-full"
					variant="alt"
					size="lg"
				/>
				
        <Popover variant="glass" trigger={<Button variant="solid" color="secondary" iconBefore={<Filter size={16} />}>Filters</Button>}>
          <div>
            <h3 className="text-lg font-semibold">Filters</h3>
            <div className="flex gap-2">
              <Button variant="solid" color="secondary">All</Button>
              <Button variant="solid" color="secondary">120 - 128 Bpm</Button>
            </div>
          </div>
        </Popover>
				<div className="flex gap-2">
					<IconButton
						icon={<Grid3x3 size={20} />}
						aria-label="Grid view"
						color={viewMode === "grid" ? "primary" : "secondary"}
						variant={viewMode === "grid" ? "solid" : "outline"}
						onClick={() => onViewChange("grid")}
					/>
					<IconButton
						icon={<List size={20} />}
						aria-label="List view"
						color={viewMode === "table" ? "primary" : "secondary"}
						variant={viewMode === "table" ? "solid" : "outline"}
						onClick={() => onViewChange("table")}
					/>
				</div>
			</div>
		</div>
	);
}
