import { useRefdata } from "../../../hooks/useRefdata";
import type { SelectOption } from "../../atoms";
import { Select } from "../../atoms";

interface FilterCategory {
  label: string;
  key: string;
  options: string[];
}

interface FilterTrayProps {
  selectedFilters: {
    [key: string]: string[];
  };
  onFilterChange: (category: string, selectedValues: string[]) => void;
}

export default function FilterTray({
  selectedFilters,
  onFilterChange,
}: FilterTrayProps) {
  const { data: filterOptions, isLoading } = useRefdata("trackfilters");

  if (isLoading) {
    return (
      <div className="w-full space-y-4 grid grid-cols-2 gap-4">
        <div className="text-sm text-muted-foreground">Loading filters...</div>
      </div>
    );
  }

  if (!filterOptions || !filterOptions.data) {
    return (
      <div className="w-full space-y-4 grid grid-cols-2 gap-4">
        <div className="text-sm text-muted-foreground">
          No filter options available
        </div>
      </div>
    );
  }

  // Map key names to display labels
  const keyToLabel: Record<string, string> = {
    genre: "Genre",
    mood: "Mood",
    key: "Key",
    artist: "Artist",
    bpm: "BPM Range",
    year: "Year Range",
  };

  // Separate categories from ranges
  const categories: FilterCategory[] = [];
  let bpmRanges: string[] = [];
  let yearRanges: string[] = [];

  filterOptions.data.forEach((item) => {
    if (item.key === "bpm") {
      bpmRanges = item.value;
    } else if (item.key === "year") {
      yearRanges = item.value;
    } else {
      categories.push({
        label: keyToLabel[item.key] || item.key,
        key: item.key,
        options: item.value,
      });
    }
  });

  // Convert string arrays to SelectOption format
  const convertToSelectOptions = (options: string[]): SelectOption[] => {
    return options.map((option) => ({ label: option, value: option }));
  };

  return (
    <div className="w-full space-y-4 grid grid-cols-2 gap-4">
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
      {bpmRanges.length > 0 && (
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
      )}

      {/* Year Range */}
      {yearRanges.length > 0 && (
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
      )}
    </div>
  );
}
