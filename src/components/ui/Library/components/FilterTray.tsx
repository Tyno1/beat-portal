import type { SelectOption } from "../../../atoms";
import { Select } from "../../../atoms";
import type { Track } from "./TrackTable";

interface FilterCategory {
	label: string;
	key: keyof Track;
	options: string[];
}

interface FilterTrayProps {
	tracks: Track[];
	selectedFilters: {
		[key: string]: string[];
	};
	onFilterChange: (category: string, selectedValues: string[]) => void;
}

export default function FilterTray({
	tracks,
	selectedFilters,
	onFilterChange,
}: FilterTrayProps) {
	// Extract unique values for each category
	const getUniqueValues = (key: keyof Track): string[] => {
		const values = tracks
			.map((track) => track[key])
			.filter((value): value is string => typeof value === "string")
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort();
		return values;
	};

	const getNumericRanges = (key: "bpm" | "year"): string[] => {
		const values = tracks.map((track) => track[key]) as number[];
		const min = Math.min(...values);
		const max = Math.max(...values);

		if (key === "bpm") {
			// Create BPM ranges
			const ranges: string[] = [];
			for (let i = 60; i <= max; i += 20) {
				const rangeEnd = Math.min(i + 19, max);
				ranges.push(`${i}-${rangeEnd} BPM`);
			}
			return ranges;
		} else {
			// Create year ranges
			const ranges: string[] = [];
			const decadeStart = Math.floor(min / 10) * 10;
			const decadeEnd = Math.ceil(max / 10) * 10;
			for (let i = decadeStart; i <= decadeEnd; i += 10) {
				ranges.push(`${i}s`);
			}
			return ranges;
		}
	};

	const categories: FilterCategory[] = [
		{
			label: "Genre",
			key: "genre",
			options: getUniqueValues("genre"),
		},
		{
			label: "Mood",
			key: "mood",
			options: getUniqueValues("mood"),
		},
		{
			label: "Key",
			key: "key",
			options: getUniqueValues("key"),
		},
		{
			label: "Artist",
			key: "artist",
			options: getUniqueValues("artist"),
		},
	];

	const bpmRanges = getNumericRanges("bpm");
	const yearRanges = getNumericRanges("year");

	// Convert string arrays to SelectOption format
	const convertToSelectOptions = (options: string[]): SelectOption[] => {
		return options.map((option) => ({ label: option, value: option }));
	};

	return (
		<div className="w-full space-y-4 p-4">
			{/* Category filters */}
			{categories.map((category) => {
				const selectOptions = convertToSelectOptions(category.options);
				return (
					<Select
						key={category.key}
						label={category.label}
						options={selectOptions}
						value={selectedFilters[category.key] || []}
						onChange={(selectedValues) =>
							onFilterChange(category.key, selectedValues)
						}
						multiple
						variant="outline"
						size="md"
						placeholder={`Select ${category.label.toLowerCase()}...`}
						maxHeight="200px"
					/>
				);
			})}

			{/* BPM Range */}
			<Select
				label="BPM Range"
				options={convertToSelectOptions(bpmRanges)}
				value={selectedFilters.bpm || []}
				onChange={(selectedValues) => onFilterChange("bpm", selectedValues)}
				multiple
				variant="outline"
				size="md"
				placeholder="Select BPM ranges..."
				maxHeight="200px"
			/>

			{/* Year Range */}
			<Select
				label="Year Range"
				options={convertToSelectOptions(yearRanges)}
				value={selectedFilters.year || []}
				onChange={(selectedValues) => onFilterChange("year", selectedValues)}
				multiple
				variant="outline"
				size="md"
				placeholder="Select year ranges..."
				maxHeight="200px"
			/>
		</div>
	);
}
