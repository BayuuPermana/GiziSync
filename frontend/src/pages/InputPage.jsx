import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Upload, Send, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { useAuth } from '@/context/AuthContext';

const InputPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([{ commodity: '', quantity: '', unit: 'kg', price: '' }]);
  const [loading, setLoading] = useState(false);
  const [commodities, setCommodities] = useState([]);

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const res = await axios.get('/commodities');
        setCommodities(res.data);
      } catch (err) {
        console.error("Error fetching commodities:", err);
      }
    };
    fetchCommodities();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { commodity: '', quantity: '', unit: 'kg', price: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-fill unit if commodity changes
    if (field === 'commodity') {
      const selectedCommodity = commodities.find(c => c.name === value);
      if (selectedCommodity) {
        newItems[index].unit = selectedCommodity.unit;
      }
    }
    
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Calculate totals and format data
    const formattedItems = items.map(item => ({
      commodity: item.commodity,
      quantity: parseFloat(item.quantity),
      unit: item.unit,
      pricePerUnit: parseFloat(item.price) / parseFloat(item.quantity),
      totalPrice: parseFloat(item.price)
    }));

    const totalExpenditure = formattedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // Get actual kitchen ID from logged in user
    // Handle case where kitchenId is populated object or just ID string
    const kitchenId = user?.kitchenId?._id || user?.kitchenId || "6568a7b0c4b5c6d7e8f9a0b1"; 

    const payload = {
      kitchen: kitchenId,
      items: formattedItems,
      totalExpenditure,
      status: 'pending'
    };

    try {
      await axios.post('/reports', payload);
      alert('Laporan Harian Berhasil Dikirim!');
      
      if (user?.role === 'admin') {
          navigate('/reports');
      } else {
          // If operator, just show success and clear form
          setItems([{ commodity: '', quantity: '', unit: 'kg', price: '' }]);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dapur Umum: {user?.kitchenId?.name || 'Jakarta Selatan 01'}</h1>
            <p className="text-xs text-slate-500">Operator: {user?.username || 'Budi Santoso'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
            <p className="text-xs text-slate-500">Laporan Harian</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-indigo-900">Form Belanja Harian</CardTitle>
                <CardDescription className="text-indigo-700/80">
                  Input data belanja bahan baku untuk makan siang gratis hari ini.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group hover:border-indigo-200 transition-colors">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button type="button" variant="ghost" size="sm" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-4 space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Komoditas</Label>
                        <select 
                          className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={item.commodity}
                          onChange={(e) => handleItemChange(index, 'commodity', e.target.value)}
                          required
                        >
                          <option value="">Pilih Komoditas</option>
                          {commodities.map(c => (
                            <option key={c._id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jumlah</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="number" 
                            placeholder="0" 
                            className="bg-white" 
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Satuan</Label>
                        <Input 
                            placeholder="kg" 
                            className="bg-white" 
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            required
                            readOnly // Make read-only as it's auto-filled
                          />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Harga Total (Rp)</Label>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          className="bg-white" 
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button type="button" variant="outline" onClick={handleAddItem} className="w-full border-dashed border-2 py-6 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                <Plus className="mr-2 h-4 w-4" /> Tambah Item Belanja
              </Button>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Label className="text-base font-medium mb-2 block">Upload Foto Nota/Struk</Label>
                <div className="flex items-center gap-4">
                  <Input type="file" className="hidden" id="file-upload" />
                  <Label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:bg-white hover:border-indigo-400 transition-all">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500">Klik untuk upload foto struk</span>
                    </div>
                  </Label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg shadow-lg hover:shadow-indigo-500/30 transition-all" disabled={loading}>
                  <Send className="mr-2 h-5 w-5" /> {loading ? 'Mengirim...' : 'Kirim Laporan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InputPage;
