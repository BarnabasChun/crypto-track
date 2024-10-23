import { Header } from '@tanstack/react-table';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
  children: React.ReactNode;
  textAlignment?: 'left' | 'right';
}

export function DataTableColumnHeader<TData, TValue>({
  header,
  children,
  textAlignment = 'right',
}: DataTableColumnHeaderProps<TData, TValue>) {
  const icon =
    {
      asc: <ArrowUp className="ml-2 h-4 w-4" />,
      desc: <ArrowDown className="ml-2 h-4 w-4" />,
    }[header.column.getIsSorted() as string] ?? null;

  return (
    <div
      className={`flex items-center ${textAlignment === 'right' ? 'justify-end' : ''}`}
    >
      {children}
      {icon}
    </div>
  );
}
