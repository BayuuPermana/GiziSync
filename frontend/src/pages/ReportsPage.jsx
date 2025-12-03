import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import axios from '../lib/axios';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await axios.get('/reports');
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetail(true);
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedReport) return;
    try {
      await axios.put(`/reports/${selectedReport._id}`, { status });
      setShowDetail(false);
      fetchReports();
    } catch (err) {
      console.error("Error updating report status:", err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Laporan & SPJ</h1>
            <p className="text-slate-500">Riwayat laporan belanja dan status verifikasi.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white">
              <Calendar className="mr-2 h-4 w-4" /> Filter Tanggal
            </Button>
            <Button variant="outline" className="bg-white">
              <Filter className="mr-2 h-4 w-4" /> Status
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Download className="mr-2 h-4 w-4" /> Export Excel
            </Button>
          </div>
        </div>

        <Card className="shadow-sm border-0">
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle>Riwayat Transaksi</CardTitle>
            <CardDescription>Daftar laporan harian yang telah disubmit.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50">
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">ID Laporan</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Tanggal</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Dapur</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Total Belanja</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {reports.map((report) => (
                    <tr key={report._id} className="border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50">
                      <td className="p-4 align-middle font-medium">{report._id.substring(0, 8)}...</td>
                      <td className="p-4 align-middle">{new Date(report.date).toLocaleDateString('id-ID')}</td>
                      <td className="p-4 align-middle">{report.kitchen?.name || 'Unknown'}</td>
                      <td className="p-4 align-middle">Rp {report.totalExpenditure?.toLocaleString('id-ID') || 0}</td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          report.status === 'verified' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : report.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewDetail(report)}>
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Detail</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {!loading && reports.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-slate-500">Belum ada laporan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {showDetail && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-2xl bg-white shadow-lg max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Detail Laporan</CardTitle>
                    <CardDescription>ID: {selectedReport._id}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowDetail(false)}>X</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-500">Tanggal</Label>
                    <div className="font-medium">{selectedReport.date ? new Date(selectedReport.date).toLocaleDateString('id-ID') : '-'}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500">Dapur</Label>
                    <div className="font-medium">{selectedReport.kitchen?.name || 'Unknown'}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500">Total Belanja</Label>
                    <div className="font-medium text-lg text-indigo-600">Rp {selectedReport.totalExpenditure?.toLocaleString('id-ID') || 0}</div>
                  </div>
                  <div>
                    <Label className="text-slate-500">Status Saat Ini</Label>
                    <div className="font-medium capitalize">{selectedReport.status}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-500 mb-2 block">Item Belanja</Label>
                  <div className="border rounded-md p-2 bg-slate-50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Item</th>
                          <th className="text-right p-2">Qty</th>
                          <th className="text-right p-2">Harga</th>
                          <th className="text-right p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReport.items?.map((item, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="p-2">{item.commodity || item.commodityName || '-'}</td>
                            <td className="p-2 text-right">{item.quantity} {item.unit}</td>
                            <td className="p-2 text-right">{item.pricePerUnit?.toLocaleString('id-ID')}</td>
                            <td className="p-2 text-right">{((item.quantity || 0) * (item.pricePerUnit || 0))?.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowDetail(false)}>Tutup</Button>
                  {selectedReport.status === 'pending' && (
                    <>
                      <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleUpdateStatus('rejected')}>
                        Tolak Laporan
                      </Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleUpdateStatus('verified')}>
                        Verifikasi Laporan
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  );
};

export default ReportsPage;
