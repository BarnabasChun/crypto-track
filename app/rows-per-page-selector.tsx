import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PER_PAGE_OPTIONS } from '@/lib/constants';

interface RowsPerPageSelectorProps {
  value: number;
  onChange: (value: string) => void;
}

export default function RowsPerPageSelector({
  value,
  onChange,
}: RowsPerPageSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <p id="rows-per-page" className="text-sm font-medium">
        Rows
      </p>
      <Select value={`${value}`} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[70px]" aria-labelledby="rows-per-page">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent side="top">
          {PER_PAGE_OPTIONS.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
