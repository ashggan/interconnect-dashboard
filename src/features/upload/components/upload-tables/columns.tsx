// Updated columns with proper fields and download button
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { FileUpload } from '@/constants/data';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const columns: ColumnDef<FileUpload>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className='max-w-[200px]'>
        <div className='font-medium'>{row.getValue('name')}</div>
        <div className='text-sm text-gray-500'>{row.original.originalName}</div>
      </div>
    )
  },

  {
    accessorKey: 'mimeType',
    header: 'Type',
    cell: ({ row }) => {
      const mimeType = row.getValue('mimeType') as string;
      const getFileType = (mime: string) => {
        if (mime.includes('csv')) return 'CSV';
        if (mime.includes('excel') || mime.includes('spreadsheet'))
          return 'Excel';
        return mime.split('/').pop()?.toUpperCase() || 'Unknown';
      };
      return getFileType(mimeType);
    }
  },
  {
    accessorKey: 'downloadCount',
    header: 'Downloads',
    cell: ({ row }) => (
      <span className='text-sm text-gray-600'>
        {row.getValue('downloadCount')} downloads
      </span>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Uploaded At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') as string);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  {
    accessorKey: 'fileSize',
    header: 'Size',
    cell: ({ row }) => {
      const bytes = row.getValue('fileSize') as number;
      const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      return formatBytes(bytes);
    }
  },
  {
    accessorKey: 'url',
    header: 'Download',
    cell: ({ row }) => {
      const url = row.getValue('url') as string;
      const handleDownload = async () => {
        try {
          // Track download count
          await fetch(`/api/upload/${row.original.id}/download`, {
            method: 'POST'
          });

          // Open download link
          window.open(url, '_blank');
        } catch (error) {
          console.error('Error tracking download:', error);
          // Still allow download even if tracking fails
          window.open(url, '_blank');
        }
      };

      return (
        <Button
          size='sm'
          variant='outline'
          onClick={handleDownload}
          className='flex items-center gap-2'
        >
          <Download className='h-4 w-4' />
          Download
        </Button>
      );
    }
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
