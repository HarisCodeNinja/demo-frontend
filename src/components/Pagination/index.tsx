import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, pageSize, totalPages, totalCount, onPageChange }: any) => (
  <div className="bg-card p-4 rounded-lg border mt-4">
    <div className="flex flex-col space-y-4">
      <div className="text-sm text-muted-foreground text-center">
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>

        {[...Array(Math.min(3, totalPages))].map((_, i) => {
          const pageNumber = Math.max(1, Math.min(totalPages - 2, page - 1)) + i;
          return (
            <Button
              key={pageNumber}
              variant={pageNumber === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  </div>
);

export default Pagination;
