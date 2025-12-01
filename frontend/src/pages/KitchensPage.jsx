import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, MapPin, Users, Trash2, Edit } from 'lucide-react';
import axios from 'axios';

const KitchensPage = () => {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newKitchen, setNewKitchen] = useState({
    name: '',
    location: { address: '', city: '', province: '' },
    capacity: 0,
    operatorName: '',
    contactNumber: ''
  });

  // Fetch Kitchens
  useEffect(() => {
    fetchKitchens();
  }, []);

  const fetchKitchens = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/kitchens');
      setKitchens(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching kitchens:", err);
      setLoading(false);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const handleEdit = (kitchen) => {
    setNewKitchen({
      name: kitchen.name,
      location: kitchen.location || { address: '', city: '', province: '' },
      capacity: kitchen.capacity,
      operatorName: kitchen.operatorName,
      contactNumber: kitchen.contactNumber
    });
    setCurrentId(kitchen._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/kitchens/${currentId}`, newKitchen);
      } else {
        await axios.post('http://localhost:5000/api/kitchens', newKitchen);
      }
      setShowForm(false);
      setIsEditing(false);
      setCurrentId(null);
      fetchKitchens(); // Refresh list
      setNewKitchen({ name: '', location: { address: '', city: '', province: '' }, capacity: 0, operatorName: '', contactNumber: '' });
    } catch (err) {
      console.error("Error saving kitchen:", err);
      alert("Failed to save kitchen");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this kitchen?')) {
      try {
        await axios.delete(`http://localhost:5000/api/kitchens/${id}`);
        fetchKitchens();
      } catch (err) {
        console.error("Error deleting kitchen:", err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manajemen Dapur</h1>
          <p className="text-slate-500">Daftar Satuan Pelayanan Gizi (Dapur Umum) yang terdaftar.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setIsEditing(false); setNewKitchen({ name: '', location: { address: '', city: '', province: '' }, capacity: 0, operatorName: '', contactNumber: '' }); }} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Tambah Dapur
        </Button>
      </div>

        {/* Create Form (Simple Toggle for now) */}
        {showForm && (
          <Card className="mb-8 border-indigo-100 shadow-md">
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Dapur' : 'Tambah Dapur Baru'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Dapur</Label>
                  <Input 
                    value={newKitchen.name} 
                    onChange={(e) => setNewKitchen({...newKitchen, name: e.target.value})} 
                    placeholder="Contoh: Dapur Jaksel 01" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kapasitas (Porsi/Hari)</Label>
                  <Input 
                    type="number"
                    value={newKitchen.capacity} 
                    onChange={(e) => setNewKitchen({...newKitchen, capacity: e.target.value})} 
                    placeholder="500" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alamat</Label>
                  <Input 
                    value={newKitchen.location.address} 
                    onChange={(e) => setNewKitchen({...newKitchen, location: {...newKitchen.location, address: e.target.value}})} 
                    placeholder="Jl. Raya..." 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kota/Kabupaten</Label>
                  <Input 
                    value={newKitchen.location.city} 
                    onChange={(e) => setNewKitchen({...newKitchen, location: {...newKitchen.location, city: e.target.value}})} 
                    placeholder="Jakarta Selatan" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nama Operator</Label>
                  <Input 
                    value={newKitchen.operatorName} 
                    onChange={(e) => setNewKitchen({...newKitchen, operatorName: e.target.value})} 
                    placeholder="Nama Penanggung Jawab" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kontak</Label>
                  <Input 
                    value={newKitchen.contactNumber} 
                    onChange={(e) => setNewKitchen({...newKitchen, contactNumber: e.target.value})} 
                    placeholder="0812..." 
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-2 mt-4">
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
                  <Button type="submit" className="bg-indigo-600 text-white">Simpan</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Kitchen List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitchens.map((kitchen) => (
            <Card key={kitchen._id} className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-2">
                    <UtensilsIcon className="h-6 w-6" />
                  </div>
                  <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-500" onClick={() => handleEdit(kitchen)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => handleDelete(kitchen._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{kitchen.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {kitchen.location?.city || 'Unknown City'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-400" /> Kapasitas:</span>
                    <span className="font-semibold">{kitchen.capacity} porsi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Operator:</span>
                    <span>{kitchen.operatorName || '-'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {!loading && kitchens.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            Belum ada data dapur. Silakan tambah dapur baru.
          </div>
        )}
      </div>
  );
};

// Simple Icon component since UtensilsCrossed might not be imported
const UtensilsIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

export default KitchensPage;
