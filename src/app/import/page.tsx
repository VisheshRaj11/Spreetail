'use client';

import React, { useState } from 'react';
import { processImport } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    setLoading(true);
    
    try {
      const text = await file.text();
      const res = await processImport(text);
      setReport(res);
      toast.success(`Successfully imported ${res.expenses.length} records!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Import Expenses</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
          />
          <Button onClick={handleImport} disabled={!file || loading} className="space-x-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{loading ? 'Processing...' : 'Upload and Process'}</span>
          </Button>
        </CardContent>
      </Card>

      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Import Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex space-x-8">
              <div>
                <p className="text-sm text-muted-foreground">Imported</p>
                <p className="text-3xl font-bold">{report.expenses.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Skipped</p>
                <p className="text-3xl font-bold text-red-500">{report.skipped}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Anomalies Detected</p>
                <p className="text-3xl font-bold text-yellow-600">{report.anomalies.length}</p>
              </div>
            </div>

            {report.anomalies.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Anomaly Log</h3>
                <div className="border border-border rounded-md overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Row</th>
                        <th className="px-4 py-3 font-medium">Issue</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                        <th className="px-4 py-3 font-medium">Action Taken</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {report.anomalies.map((anomaly: any, i: number) => (
                        <tr key={i} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3">{anomaly.row}</td>
                          <td className="px-4 py-3 font-medium">{anomaly.type}</td>
                          <td className="px-4 py-3">{anomaly.description}</td>
                          <td className="px-4 py-3 text-accent-foreground font-medium">{anomaly.actionTaken}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-border">
              <Button onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
