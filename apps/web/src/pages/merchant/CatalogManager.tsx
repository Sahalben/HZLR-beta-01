import React, { useState, useEffect } from 'react';
import { Plus, Search, Upload, Edit2, Eye, EyeOff, Trash2, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';
import { storeApi } from '@/lib/storeApi';
import { toast } from '@/hooks/use-toast';

export default function CatalogManager() {
  const [merchant, setMerchant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form, setForm] = useState({ name: '', price: '', mrp: '', unit: 'piece', stock: '', categoryId: '', description: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([storeApi.getMerchantMe(), storeApi.getCategories()])
      .then(([m, cats]) => {
        setMerchant(m);
        setCategories(cats.flatMap((c: any) => [c, ...(c.children || [])]));
        return storeApi.getProducts(m.id);
      })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    if (!merchant) return;
    const p = await storeApi.getProducts(merchant.id);
    setProducts(p);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast({ title: 'Name and price required', variant: 'destructive' }); return; }
    try {
      if (editingProduct) {
        await storeApi.updateProduct(editingProduct.id, { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 });
        toast({ title: 'Product updated ✓' });
      } else {
        await storeApi.addProduct({ ...form, price: parseFloat(form.price), mrp: parseFloat(form.mrp) || null, stock: parseInt(form.stock) || 0 });
        toast({ title: 'Product added ✓' });
      }
      setShowAddForm(false); setEditingProduct(null);
      setForm({ name: '', price: '', mrp: '', unit: 'piece', stock: '', categoryId: '', description: '' });
      refresh();
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const handleToggleActive = async (product: any) => {
    await storeApi.updateProduct(product.id, { isActive: !product.isActive });
    refresh();
  };

  const handleCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !merchant) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/v1/store/products/bulk-import`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      });
      const data = await res.json();
      toast({ title: `Import complete`, description: `Created: ${data.created}, Updated: ${data.updated}, Skipped: ${data.skipped}` });
      refresh();
    } catch (e: any) { toast({ title: 'Import failed', description: e.message, variant: 'destructive' }); }
    finally { setUploading(false); }
  };

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppShell>
      <div className="min-h-screen bg-background pb-10">
        <div className="px-4 pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-foreground">Catalog</h1>
              <p className="text-sm text-muted-foreground">{products.length} products</p>
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" className="border-amber-500 text-amber-600 font-bold pointer-events-none" id="btn-import-csv">
                  <Upload size={14} className="mr-1" />{uploading ? 'Importing...' : 'CSV'}
                </Button>
                <input type="file" accept=".csv" className="hidden" onChange={handleCSV} />
              </label>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-bold border-0"
                onClick={() => { setShowAddForm(true); setEditingProduct(null); }} id="btn-add-product">
                <Plus size={14} className="mr-1" /> Add
              </Button>
            </div>
          </div>

          {/* Add / Edit Form */}
          {(showAddForm || editingProduct) && (
            <Card className="p-4 border border-amber-200/50 bg-amber-50/50 dark:bg-amber-900/10 mb-4 space-y-3">
              <h3 className="font-black text-sm">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <input className="input-field" placeholder="Product name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} id="input-product-name" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" className="input-field" placeholder="Price ₹ *" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} id="input-product-price" />
                <input type="number" className="input-field" placeholder="MRP ₹" value={form.mrp} onChange={e => setForm(f => ({ ...f, mrp: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" className="input-field" placeholder="Stock qty" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                <select className="input-field" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                  {['piece', 'kg', 'litre', 'pack', 'dozen'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <select className="input-field" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                <option value="">Select category (optional)</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.parentId ? '  ↳ ' : ''}{c.name}</option>)}
              </select>
              <div className="flex gap-2">
                <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold border-0" onClick={handleSave} id="btn-save-product">Save</Button>
                <Button variant="outline" className="flex-1" onClick={() => { setShowAddForm(false); setEditingProduct(null); }}>Cancel</Button>
              </div>
            </Card>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="input-field pl-9" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} id="catalog-search" />
          </div>

          {/* Product list */}
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 mx-auto text-muted-foreground/20 mb-3" />
              <p className="font-bold text-foreground">No products yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add your first product or import via CSV.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(p => (
                <Card key={p.id} className={`p-3 border border-border/50 flex items-center gap-3 ${!p.isActive ? 'opacity-50' : ''}`}>
                  <div className="w-12 h-12 bg-muted rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-xl">
                    {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : '🛒'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground line-clamp-1">{p.name}</p>
                    <p className="text-xs text-muted-foreground">₹{p.price} · Stock: {p.stock} {p.category?.name ? `· ${p.category.name}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => { setEditingProduct(p); setForm({ name: p.name, price: p.price.toString(), mrp: p.mrp?.toString() || '', unit: p.unit, stock: p.stock.toString(), categoryId: p.categoryId || '', description: p.description || '' }); setShowAddForm(false); }}
                      className="p-2 hover:bg-muted rounded-lg transition-colors" id={`btn-edit-${p.id}`}><Edit2 size={15} className="text-muted-foreground" /></button>
                    <button onClick={() => handleToggleActive(p)} className="p-2 hover:bg-muted rounded-lg transition-colors" id={`btn-toggle-${p.id}`}>
                      {p.isActive ? <Eye size={15} className="text-green-500" /> : <EyeOff size={15} className="text-muted-foreground" />}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`.input-field { width: 100%; background: hsl(var(--card)); border: 1px solid hsl(var(--border) / 0.7); border-radius: 0.75rem; padding: 0.65rem 1rem; font-size: 0.875rem; outline: none; }`}</style>
    </AppShell>
  );
}
