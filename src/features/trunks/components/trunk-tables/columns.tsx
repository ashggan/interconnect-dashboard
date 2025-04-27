// src/features/trunks/components/trunk-tables/columns.tsx
'use client';
import { Trunk } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Trunk>[] = [
  {
    accessorKey: 'name',
    header: 'Trunk Name'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'partner.partner_name',
    header: 'Partner',
    cell: ({ row }) => row.original.partner?.partner_name || 'N/A'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
