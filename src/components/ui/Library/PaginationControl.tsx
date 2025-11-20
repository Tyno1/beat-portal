import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "../../atoms";

type PaginationControlProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

export default function PaginationControl({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  hasNext,
  hasPrevious,
}: PaginationControlProps) {
  return (
    <div className="flex items-center gap-4 justify-end mt-4">
      <IconButton
        icon={<ChevronLeft size={16} />}
        aria-label="Previous"
        color="primary"
        variant="solid"
        size="sm"
        onClick={onPrevious}
        disabled={!hasPrevious}
      />
      <span className="text-sm text-muted-foreground">
        {currentPage} of {totalPages}
      </span>
      <IconButton
        icon={<ChevronRight size={16} />}
        aria-label="Next"
        color="primary"
        variant="solid"
        size="sm"
        onClick={onNext}
        disabled={!hasNext}
      />
    </div>
  );
}
