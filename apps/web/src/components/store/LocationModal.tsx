import React, { useState } from 'react';
import { MapPin, Navigation, Search, X, Loader2 } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const LocationModal = () => {
    const { isModalOpen, setIsModalOpen, detectLocation, setCoordinates, setAddressName } = useLocation();
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&countrycodes=in`);
            const data = await res.json();
            setSearchResults(data);
        } catch {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLocation = (result: any) => {
        setCoordinates({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
        const name = result.name || result.display_name.split(',')[0];
        setAddressName(name);
        setIsModalOpen(false);
    };

    const handleDetect = async () => {
        setIsDetecting(true);
        try {
            await detectLocation();
        } catch (error) {
            alert('Failed to detect location. Please search manually.');
        } finally {
            setIsDetecting(false);
        }
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 pb-0">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="font-black text-xl text-slate-800">Select Location</h2>
                                <p className="text-xs font-semibold text-slate-500">We need your location to show available items</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto">
                            <button 
                                onClick={handleDetect}
                                disabled={isDetecting}
                                className="w-full flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100 hover:bg-amber-100 transition-colors mb-6 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors text-amber-600">
                                        {isDetecting ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} />}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-amber-900 text-sm">Use current location</h3>
                                        <p className="text-[11px] text-amber-700/80">Using GPS</p>
                                    </div>
                                </div>
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex-1 h-px bg-slate-100" />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">OR</span>
                                <div className="flex-1 h-px bg-slate-100" />
                            </div>

                            <form onSubmit={handleSearch} className="relative mb-4">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 text-slate-800"
                                    placeholder="Search for your area or apartment..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button type="submit" className="hidden" />
                            </form>

                            <div className="space-y-2">
                                {isSearching ? (
                                    <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-slate-300" /></div>
                                ) : searchResults.map((res: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectLocation(res)}
                                        className="w-full flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left border border-transparent hover:border-slate-100"
                                    >
                                        <MapPin size={20} className="text-slate-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 leading-tight">{res.name || res.display_name.split(',')[0]}</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{res.display_name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
