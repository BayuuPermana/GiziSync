import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, ShoppingBasket } from 'lucide-react';
import axios from '../lib/axios';

const CommoditiesPage = () => {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCommodity, setNewCommodity] = useState({
    name: '',
    averagePrice: '',
    unit: ''
  });

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      const res = await axios.get('/commodities');
      setCommodities(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching commodities:", err);
      setLoading(false);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const handleEdit = (commodity) => {
    setNewCommodity({
      name: commodity.name,
      averagePrice: commodity.averagePrice,
      unit: commodity.unit
    });
    setCurrentId(commodity._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/commodities/${currentId}`, newCommodity);
      } else {
        await axios.post('/commodities', newCommodity);
      }
      setShowForm(false);
      setIsEditing(false);
      setCurrentId(null);
      fetchCommodities();
      setNewCommodity({ name: '', averagePrice: '', unit: '' });
    } catch (err) {
      console.error("Error saving commodity:", err);
      alert("Failed to save commodity");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this commodity?')) {
      try {
        await axios.delete(`/commodities/${id}`);
        fetchCommodities();
      } catch (err) {
        console.error("Error deleting commodity:", err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Komoditas & Harga</h1>
          <p className="text-slate-500">Kelola daftar bahan pokok dan harga acuan pasar.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setIsEditing(false); setNewCommodity({ name: '', averagePrice: '', unit: '' }); }} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Tambah Komoditas
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 border-indigo-100 shadow-md">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Komoditas' : 'Tambah Komoditas Baru'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Nama Komoditas</Label>
                <Input 
                  value={newCommodity.name} 
                  onChange={(e) => setNewCommodity({...newCommodity, name: e.target.value})} 
                  placeholder="Contoh: Beras Premium" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Harga Rata-rata (Rp)</Label>
                <Input 
                  type="number"
                  value={newCommodity.averagePrice} 
                  onChange={(e) => setNewCommodity({...newCommodity, averagePrice: e.target.value})} 
                  placeholder="14000" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Satuan</Label>
                <Input 
                  value={newCommodity.unit} 
                  onChange={(e) => setNewCommodity({...newCommodity, unit: e.target.value})} 
                  placeholder="kg / liter" 
                  required
                />
              </div>
              <div className="col-span-3 flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
                <Button type="submit" className="bg-indigo-600 text-white">Simpan</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {commodities.map((item) => (
          <Card key={item._id} className="hover:shadow-lg transition-shadow border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-2">
                  <ShoppingBasket className="h-6 w-6" />
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" aria-label={`Edit ${item.name}`} className="text-slate-400 hover:text-indigo-500" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Delete ${item.name}`} className="text-slate-400 hover:text-red-500" onClick={() => handleDelete(item._id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <CardDescription>
                Update terakhir: {new Date(item.updatedAt).toLocaleDateString('id-ID')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Harga Acuan:</span>
                <span className="font-bold text-lg">Rp {item.averagePrice.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">/ {item.unit}</span></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!loading && commodities.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          Belum ada data komoditas.
        </div>
      )}
    </div>
  );
};

export default CommoditiesPage;
