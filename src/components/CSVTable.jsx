// components/CSVTable.jsx
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const CSVTable = ({ data, headers }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle filtering
  const handleFilterChange = (header, value) => {
    setFilters((prev) => ({
      ...prev,
      [header]: value,
    }));
  };

  // Apply sorting and filtering
  const filteredAndSortedData = useMemo(() => {
    // First apply filters
    let filteredData = [...data];

    Object.keys(filters).forEach((header) => {
      if (filters[header]) {
        filteredData = filteredData.filter((item) => {
          return String(item[header])
            .toLowerCase()
            .includes(filters[header].toLowerCase());
        });
      }
    });

    // Then apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const valueA = String(a[sortConfig.key]).toLowerCase();
        const valueB = String(b[sortConfig.key]).toLowerCase();

        if (valueA < valueB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [data, filters, sortConfig]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>CSV Data</CardTitle>
        <CardDescription>
          Displaying {filteredAndSortedData.length} of {data.length} rows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="px-2 py-1">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        onClick={() => requestSort(header)}
                        className="h-8 px-2 text-left font-medium"
                      >
                        {header}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                      <Input
                        placeholder={`Filter ${header}...`}
                        value={filters[header] || ""}
                        onChange={(e) =>
                          handleFilterChange(header, e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.length > 0 ? (
                filteredAndSortedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header) => (
                      <TableCell
                        key={`${rowIndex}-${header}`}
                        className="px-2 py-1"
                      >
                        {row[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="h-24 text-center"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVTable;
