import { Button } from "../../../atoms";

type PaginationControlProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function PaginationControl({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: PaginationControlProps) {
  return (
    <div className="flex items-center gap-2 justify-end mt-4">
      <Button variant="solid" color="primary" size="sm" onClick={onPrevious}>
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        {currentPage} of {totalPages}
      </span>
      <Button variant="solid" color="primary" size="sm" onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
