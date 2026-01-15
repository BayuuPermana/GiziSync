import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Pencil, History, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const CommodityTable = ({ commodities, onEdit, onViewHistory, onSort, sortConfig }) => {
  const getSortIcon = (key) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 text-slate-300" />;
  };

  const getCategoryBadgeClass = (category) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    switch (category) {
      case "Karbohidrat": return `${base} bg-orange-100 text-orange-800`;
      case "Protein Hewani": return `${base} bg-red-100 text-red-800`;
      case "Protein Nabati": return `${base} bg-amber-100 text-amber-800`;
      case "Sayuran": return `${base} bg-emerald-100 text-emerald-800`;
      case "Buah-buahan": return `${base} bg-lime-100 text-lime-800`;
      default: return `${base} bg-slate-100 text-slate-800`;
    }
  };

  const SortableHead = ({ label, sortKey, align = "text-left" }) => (
    <TableHead className={align}>
      <Button 
        variant="ghost" 
        onClick={() => onSort(sortKey)} 
        className="-ml-4 h-8 font-bold text-slate-600 hover:text-indigo-600 hover:bg-transparent"
      >
        {label}
        {getSortIcon(sortKey)}
      </Button>
    </TableHead>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <SortableHead label="Nama" sortKey="name" />
            <SortableHead label="Kategori" sortKey="category" />
            <SortableHead label="Wilayah" sortKey="region" />
            <TableHead className="font-bold text-slate-600">Satuan</TableHead>
            <TableHead className="text-right">
                <Button 
                    variant="ghost" 
                    onClick={() => onSort('price')} 
                    className="-mr-4 h-8 font-bold text-slate-600 hover:text-indigo-600 hover:bg-transparent"
                >
                    Harga (Rp)
                    {getSortIcon('price')}
                </Button>
            </TableHead>
            <TableHead className="text-center font-bold text-slate-600">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commodities.map((item) => (
            <TableRow key={item._id} className="hover:bg-slate-50/80 transition-colors">
              <TableCell className="font-bold text-slate-900">{item.name}</TableCell>
              <TableCell>
                <span className={getCategoryBadgeClass(item.category)}>
                    {item.category || 'Lainnya'}
                </span>
              </TableCell>
              <TableCell className="text-slate-600">{item.region || '-'}</TableCell>
              <TableCell className="text-slate-600">{item.unit || '-'}</TableCell>
              <TableCell className="text-right font-mono font-semibold text-slate-900">
                {new Intl.NumberFormat('id-ID').format(item.price || item.averagePrice || 0)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                    title="Ubah Harga"
                    aria-label={`Ubah harga ${item.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewHistory(item)}
                    className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    title="Riwayat Harga"
                    aria-label={`Lihat riwayat harga ${item.name}`}
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {commodities.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                Tidak ada data komoditas yang cocok dengan kriteria Anda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommodityTable;
