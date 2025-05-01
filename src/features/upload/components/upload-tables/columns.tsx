// src/features/upload/components/upload-tables/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { FileUpload } from '@/constants/data';

export const columns: ColumnDef<FileUpload>[] = [
  {
    accessorKey: 'fileName',
    header: 'File Name'
  },
  {
    accessorKey: 'fileType',
    header: 'Type'
  },
  {
    accessorKey: 'uploadDate',
    header: 'Uploaded At'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
