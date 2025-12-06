import { Filter, Grid3x3, List, Search } from "lucide-react";
import { useState } from "react";
import { IconButton, Input } from "../../atoms";
import { Modal } from "../../molecules";
import FilterTray from "./FilterTray";

export type ViewMode = "table" | "grid";

interface LibraryToolbarProps {
	viewMode: ViewMode;
	onViewChange: (view: ViewMode) => void;
	selectedFilters: {
		[key: string]: string[];
	};
	onFilterChange: (category: string, selectedValues: string[]) => void;
	onSearchTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	searchText: string;
}

export default function LibraryToolbar({
	viewMode,
	onViewChange,
	selectedFilters,
	onFilterChange,
	onSearchTextChange,
	searchText,
}: LibraryToolbarProps) {
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

	return (
		<div className="space-y-3 px-2">
			<div className="flex gap-3 items-center">
				<Input
					placeholder="Search Tracks, year, artists or genre..."
					leftIcon={<Search />}
					containerClassName="flex-1 rounded-full"
					variant="filled"
					size="lg"
					value={searchText}
					onChange={onSearchTextChange}
				/>

				<Modal
					open={isFilterModalOpen}
					onClose={() => setIsFilterModalOpen(false)}
					onOpen={() => setIsFilterModalOpen(true)}
					title="Filters"
					trigger={
						<span className="flex items-center gap-2">
							<Filter size={16} /> Filters
						</span>
					}
					buttonVariant="solid"
					buttonColor="secondary"
					buttonSize="md"
					buttonRadius="xl"
					size="lg"
					contentClassName="max-h-[80vh]"
				>
					<FilterTray
						selectedFilters={selectedFilters}
						onFilterChange={onFilterChange}
					/>
				</Modal>
				<div className="flex gap-2">
					<IconButton
						icon={<Grid3x3 size={20} />}
						aria-label="Grid view"
						color={viewMode === "grid" ? "primary" : "secondary"}
						variant="solid"
						onClick={() => onViewChange("grid")}
					/>
					<IconButton
						icon={<List size={20} />}
						aria-label="List view"
						color={viewMode === "table" ? "primary" : "secondary"}
						variant="solid"
						onClick={() => onViewChange("table")}
					/>
				</div>
			</div>
		</div>
	);
}
