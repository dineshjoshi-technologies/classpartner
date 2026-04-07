import { useState } from "react";
import { Card } from "./card";

interface Column<T> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
  hidden?: boolean;
  hiddenOn?: "sm" | "md" | "lg";
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  actions?: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No data available",
  actions,
  className = "",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sortDir === "asc" ? 1 : -1;
        if (bVal == null) return sortDir === "asc" ? -1 : 1;
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      })
    : data;

  const visibleCols = columns.filter((c) => !c.hidden);

  return (
    <Card className={className} padding="sm">
      <div className="overflow-x-auto">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {visibleCols.map((col) => (
                <th
                  key={col.key}
                  className={`text-left py-2 px-2 font-medium text-gray-500 cursor-pointer select-none hover:text-gray-700 ${
                    col.className || ""
                  } ${col.hiddenOn === "sm" ? "hidden sm:table-cell" : col.hiddenOn === "md" ? "hidden md:table-cell" : col.hiddenOn === "lg" ? "hidden lg:table-cell" : ""}`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {sortKey === col.key && (
                      <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </span>
                </th>
              ))}
              {actions && <th className="text-left py-2 px-2 font-medium text-gray-500">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td className="py-8 text-center text-gray-400" colSpan={visibleCols.length + (actions ? 1 : 0)}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {visibleCols.map((col) => (
                    <td
                      key={col.key}
                      className={`py-2 px-2 ${col.className || ""} ${
                        col.hiddenOn === "sm"
                          ? "hidden sm:table-cell"
                          : col.hiddenOn === "md"
                          ? "hidden md:table-cell"
                          : col.hiddenOn === "lg"
                          ? "hidden lg:table-cell"
                          : ""
                      }`}
                    >
                      {col.render ? col.render(row[col.key], row) : (String(row[col.key] ?? ""))}
                    </td>
                  ))}
                  {actions && <td className="py-2 px-2">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
