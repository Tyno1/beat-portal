import { Button } from "../../../atoms";

interface FilterChip {
  label: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  key: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
}

export default function FilterChips({ chips }: FilterChipsProps) {
  console.log(chips);
  return (
    <div className="flex gap-2 flex-wrap">
      {chips.map((chip) =>(
        <Button
          key={chip.key}
          variant="solid"
          color={chip.active ? "primary" : "secondary"}
          size="sm"
          radius="full"
          onClick={chip.onClick}
        >
          {typeof chip.label === "string" ? chip.label.charAt(0).toUpperCase() + chip.label.slice(1) : chip.label}
        </Button>
      ))}
    </div>
  );
}

