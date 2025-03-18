"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CSVTable from "@/components/CSVTable";

export default function Home() {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const parseCSV = (text) => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());
    setHeaders(headers);

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue;

      const values = lines[i].split(",").map((value) => value.trim());
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }
    setCsvData(data);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        parseCSV(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        parseCSV(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          CSV Insight
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Import CSV File</CardTitle>
            <CardDescription>
              Upload your CSV file by clicking the button or dragging and
              dropping it below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Drag and drop your CSV file here
              </h3>
              <p className="mt-1 text-xs text-gray-500">Or</p>
              <div className="mt-4">
                <Input
                  type="file"
                  id="file-upload"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById("file-upload").click()}
                  className="px-6"
                >
                  Import CSV
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-gray-500">
            Supported format: .csv files only
          </CardFooter>
        </Card>

        {csvData.length > 0 && <CSVTable data={csvData} headers={headers} />}
      </div>
    </div>
  );
}
