import { Button } from "../../../atoms";

interface FilterChip {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface FilterChipsProps {
  chips: FilterChip[];
}

export default function FilterChips({ chips }: FilterChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {chips.map((chip, index) => (
        <Button
          key={`${chip.label}-${index}`}
          variant="solid"
          color={chip.active ? "primary" : "secondary"}
          size="sm"
          radius="full"
          onClick={chip.onClick}
        >
          {chip.label}
        </Button>
      ))}
    </div>
  );
}

