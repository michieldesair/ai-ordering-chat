'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

import { types } from '@/data/data';
import { type Vector } from '@/data/schema';

export const columns: ColumnDef<Vector>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = types.find((type) => type.value === row.original.type);

      return (
        <div className="flex gap-2">
          {type && (
            <Badge variant="outline" style={{ backgroundColor: type.color }}>
              {type.label}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'text_content',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Content" />,
    cell: ({ row }) => <div className="flex">{row.getValue('text_content')}</div>,
  },
  {
    accessorKey: 'vector',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Vector" />,
    cell: ({ row }) => <div className="w-[160px]">{row.getValue('vector')}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
