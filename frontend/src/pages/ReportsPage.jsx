import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Download, Filter, Calendar, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import axios from '../lib/axios';
import SearchBar from '../components/SearchBar';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (sortConfig.key) {
        params.sortBy = sortConfig.key;
        params.order = sortConfig.direction;
      }
      const res = await axios.get('/reports', { params });
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [searchQuery, statusFilter, sortConfig]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewDetail = async (report) => {
    setSelectedReport(report);
    setShowDetail(true);
    setLoadingDetail(true);
    try {
      const res = await axios.get(`/reports/${report._id}`);
      setSelectedReport(res.data);
    } catch (err) {
      console.error("Error fetching report details:", err);
    } finally {
      setLoadingDetail(false);
    }
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

  const SortableHead = ({ label, sortKey, className = "" }) => (
    <th className={`h-12 px-4 align-middle font-medium text-slate-500 ${className}`}>
      <Button variant="ghost" onClick={() => handleSort(sortKey)} className="-ml-4 h-8 hover:bg-transparent">
        {label}
        {sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : <ArrowUpDown className="ml-2 h-4 w-4" />}
      </Button>
    </th>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Laporan & SPJ</h1>
            <p className="text-slate-500">Riwayat laporan belanja dan status verifikasi.</p>
          </div>
          <div className="flex gap-2">
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white whitespace-nowrap">
              <Download className="mr-2 h-4 w-4" /> Export Excel
            </Button>
          </div>
        </div>

        <div className="mb-6 w-full max-w-sm">
          <SearchBar onSearch={handleSearch} placeholder="Cari nama dapur..." />
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
                    <SortableHead label="Tanggal" sortKey="date" />
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Dapur</th>
                    <SortableHead label="Total Belanja" sortKey="totalExpenditure" />
                    <SortableHead label="Status" sortKey="status" />
                    <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500">Memuat laporan...</td>
                    </tr>
                  ) : (
                    reports.map((report) => (
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
                    ))
                  )}
                  {!loading && reports.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-slate-500">Tidak ada laporan yang ditemukan.</td>
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
                {loadingDetail ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  );
};

export default ReportsPage;
