import { Filter, Grid3x3, List, Search } from "lucide-react";
import { IconButton, Input } from "../../../atoms";
import { Popover } from "../../../molecules";
import FilterTray from "./FilterTray";
import type { Track } from "./TrackTable";

export type ViewMode = "table" | "grid";

interface LibraryToolbarProps {
	viewMode: ViewMode;
	onViewChange: (view: ViewMode) => void;
	tracks: Track[];
	selectedFilters: {
		[key: string]: string[];
	};
	onFilterChange: (category: string, selectedValues: string[]) => void;
}

export default function LibraryToolbar({
	viewMode,
	onViewChange,
	tracks,
	selectedFilters,
	onFilterChange,
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

				<Popover
					placement="bottom-end"
					buttonVariant="solid"
					buttonColor="secondary"
          color="muted"
					buttonSize="md"
					buttonRadius="xl"
					variant="glass"
					trigger={
						<span className="flex items-center gap-2">
							<Filter size={16} /> Filters
						</span>
					}
          contentClassName="w-[60vw]"
				>
					<FilterTray
						tracks={tracks}
						selectedFilters={selectedFilters}
						onFilterChange={onFilterChange}
					/>
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
