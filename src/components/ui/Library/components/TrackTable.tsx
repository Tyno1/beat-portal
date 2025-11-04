import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { useState } from "react";
import { IconButton } from "../../../atoms";

export interface Track {
  id: number;
  trackName: string;
  artist: string;
  year: number;
  bpm: number;
  key: string;
  genre: string;
  mood: string;
}

interface TrackTableProps {
  data: Track[];
}

export default function TrackTable({ data }: TrackTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Track>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          ID
          <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      accessorKey: "trackName",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Track Name
          <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      accessorKey: "artist",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Artist
          <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Year
          <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      accessorKey: "bpm",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          BPM
          <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      accessorKey: "key",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Key
          <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      accessorKey: "genre",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Genre
          <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      accessorKey: "mood",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Mood
          <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <IconButton
          icon={<MoreVertical />}
          aria-label="Actions"
          color="secondary"
          variant="plain"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            // Handle actions
          }}
          className="hover:text-primary/50 transition-opacity duration-200"
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <table className="w-full bg-card/30">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-border bg-muted/30"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-semibold text-foreground"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-sidebar">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border hover:bg-muted/10 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm text-foreground truncate max-w-[100px]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
