
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalKitchens: 0,
    mealsServed: 0,
    inflationAlerts: 0
  });
  const [trends, setTrends] = useState([]);
  const [kitchenStats, setKitchenStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Kitchen Count
        const resKitchens = await axios.get('/kitchens');
        const kitchenCount = resKitchens.data.length;

        // Fetch Stats (Trends & Regional)
        const resStats = await axios.get('/reports/stats');
        
        setStats({
          totalKitchens: kitchenCount,
          mealsServed: kitchenCount * 500, // Estimate: 500 meals per kitchen
          inflationAlerts: 0 // To be calculated from regional stats if needed
        });
        setTrends(resStats.data.trends);
        setKitchenStats(resStats.data.kitchenStats);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Government Dashboard</h2>
          <p className="text-slate-500">Welcome back, Admin. Here's the national nutrition overview.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium text-slate-900">Badan Gizi Nasional</p>
            <p className="text-xs text-slate-500">Central Admin</p>
          </div>
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold cursor-pointer" onClick={handleLogout}>
            BG
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Kitchens</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalKitchens}</div>
            <p className="text-xs text-slate-500">Registered units</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Est. Meals Served</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.mealsServed.toLocaleString()}</div>
            <p className="text-xs text-slate-500">Daily capacity</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Inflation Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inflationAlerts} Regions</div>
            <p className="text-xs text-slate-500">High price anomalies detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Status (Map Replacement) */}
        <Card className="h-96 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-500" />
              Regional Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 sticky top-0">
                    <tr>
                        <th className="p-3">Kitchen</th>
                        <th className="p-3">City</th>
                        <th className="p-3 text-right">Last Report</th>
                        <th className="p-3 text-right">Expenditure</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {kitchenStats.map((k, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-medium">{k.kitchenName}</td>
                            <td className="p-3 text-slate-500">{k.city || '-'}</td>
                            <td className="p-3 text-right text-slate-500">{new Date(k.date).toLocaleDateString('id-ID')}</td>
                            <td className="p-3 text-right font-medium text-indigo-600">Rp {k.totalExpenditure.toLocaleString('id-ID')}</td>
                        </tr>
                    ))}
                    {kitchenStats.length === 0 && (
                        <tr>
                            <td colSpan="4" className="p-4 text-center text-slate-500">No reports available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Price Trends Chart */}
        <Card className="h-96 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-slate-500" />
              Price Trends (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    labelStyle={{ color: '#64748b' }}
                />
                <Legend />
                {/* Dynamic Lines based on data keys would be better, but hardcoding common ones for MVP */}
                <Line type="monotone" dataKey="Beras" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Beras" />
                <Line type="monotone" dataKey="Telur" stroke="#ea580c" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Telur" />
                <Line type="monotone" dataKey="Daging Ayam" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Daging Ayam" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
