'use client';
import { Partner } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export const columns: ColumnDef<Partner>[] = [
  {
    accessorKey: 'partner_name',
    header: 'Partner Name'
  },
  {
    accessorKey: 'country',
    header: 'Country'
  },
  {
    accessorKey: 'currency',
    header: 'Currency'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
