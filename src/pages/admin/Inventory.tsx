import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, Vehicle } from '../../data/mockData';
import { Search, Plus, Edit, Trash2, AlertTriangle, X } from 'lucide-react';
import { useVehicles } from '../../context/VehicleContext';
import { useRenderableImage } from '../../lib/imageUtils';

export default function AdminInventory() {
  const { vehicles, updateVehicle, removeVehicle } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && vehicleToDelete && !isDeleting) {
        setVehicleToDelete(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vehicleToDelete, isDeleting]);

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      setIsDeleting(true);
      await removeVehicle(vehicleToDelete.id);
      setVehicleToDelete(null);
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = (v.make + ' ' + v.model + ' ' + (v.registration || '')).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-widest uppercase">Inventory Management</h1>
          <p className="text-zinc-400 text-xs mt-2 font-mono uppercase tracking-wider">Manage all vehicles in your premium dealership.</p>
        </div>
        <Link to="/dealer-management/inventory/add" className="inline-flex items-center px-6 py-3.5 bg-[#00C0FF] hover:bg-white text-zinc-950 rounded-xl text-xs font-bold tracking-widest font-mono uppercase transition-all shadow-lg shadow-[#00C0FF]/10">
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Link>
      </div>

      <div className="bg-zinc-950/65 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 bg-[#00C0FF]/5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search vehicles by make, model, or registry code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/30 border border-white/5 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-[#00C0FF] transition-all font-mono"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="bg-zinc-900/30 border border-white/5 text-zinc-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#00C0FF] transition-all font-mono uppercase tracking-wider"
          >
            <option className="bg-zinc-950 text-white">All Statuses</option>
            <option className="bg-zinc-950 text-white">Available</option>
            <option className="bg-zinc-950 text-white">Sold</option>
            <option className="bg-zinc-950 text-white">Booked</option>
          </select>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#00C0FF]/5 text-[#00C0FF] text-[10px] uppercase font-bold tracking-widest font-mono border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Reg. No</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-250 font-mono">
              {filteredVehicles.map(car => (
                <tr key={car.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/5 bg-zinc-900 shrink-0">
                        <AdminTableRowImage imgUrl={car.images?.[0]} alt={`${car.make} ${car.model}`} />
                      </div>
                      <div>
                        <p className="font-sans font-bold text-white text-sm">{car.make} {car.model}</p>
                        <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider">{car.year} • {car.fuelType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300 font-bold">{car.registration}</td>
                  <td className="px-6 py-4 font-sans font-bold text-white text-sm">{formatPrice(car.price)}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={car.status}
                      onChange={(e) => updateVehicle(car.id, { status: e.target.value as any })}
                      className={`px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-wider border outline-none cursor-pointer bg-zinc-950 focus:border-[#00C0FF] transition-all ${
                        car.status === 'Available' ? 'border-[#00C0FF]/25 text-[#00C0FF]' :
                        car.status === 'Sold' ? 'border-zinc-700 text-zinc-400' :
                        'border-amber-500/20 text-amber-500'
                      }`}
                    >
                      <option value="Available" className="bg-zinc-950 text-[#00C0FF]">Available</option>
                      <option value="Booked" className="bg-zinc-950 text-amber-500">Booked</option>
                      <option value="Sold" className="bg-zinc-950 text-zinc-400">Sold</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/dealer-management/inventory/edit/${car.id}`} className="p-2 text-zinc-400 hover:text-[#00C0FF] bg-zinc-900/30 hover:bg-white/5 border border-white/5 hover:border-[#00C0FF]/30 rounded-xl transition-all" title="Edit Vehicle">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        type="button"
                        onClick={() => setVehicleToDelete(car)} 
                        className="p-2 text-zinc-400 hover:text-red-400 bg-zinc-900/30 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl transition-all"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Grid Layout - optimized for portrait & small devices */}
        <div className="block md:hidden divide-y divide-white/5">
          {filteredVehicles.map(car => (
            <div key={car.id} className="p-4 flex flex-col space-y-4">
              <div className="flex space-x-4 items-start">
                <div className="w-20 h-16 rounded-lg overflow-hidden border border-white/5 shrink-0 bg-zinc-900">
                  <AdminTableRowImage imgUrl={car.images?.[0]} alt={`${car.make} ${car.model}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-sans font-extrabold text-white text-sm truncate">{car.make} {car.model}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-mono uppercase tracking-wider">{car.year} • {car.fuelType}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-zinc-500">{car.registration || "N/A"}</span>
                    <span className="text-xs font-sans font-bold text-white">{formatPrice(car.price)}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons row */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/[0.03]">
                <div className="flex-1">
                  <select 
                    value={car.status}
                    onChange={(e) => updateVehicle(car.id, { status: e.target.value as any })}
                    className={`w-full py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest border outline-none cursor-pointer bg-zinc-950 focus:border-[#00C0FF] transition-all font-mono ${
                      car.status === 'Available' ? 'border-[#00C0FF]/25 text-[#00C0FF]' :
                      car.status === 'Sold' ? 'border-zinc-700 text-zinc-400' :
                      'border-amber-500/20 text-amber-500'
                    }`}
                  >
                    <option value="Available" className="bg-zinc-950 text-[#00C0FF]">Available</option>
                    <option value="Booked" className="bg-zinc-950 text-amber-500">Booked</option>
                    <option value="Sold" className="bg-zinc-950 text-zinc-400">Sold</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <Link to={`/dealer-management/inventory/edit/${car.id}`} className="p-2 text-zinc-300 hover:text-[#00C0FF] bg-zinc-900/40 hover:bg-white/5 border border-white/5 hover:border-[#00C0FF]/45 rounded-xl transition-all" title="Edit Car">
                    <Edit className="w-4.5 h-4.5" />
                  </Link>
                  <button 
                    type="button"
                    onClick={() => setVehicleToDelete(car)} 
                    className="p-2 text-zinc-300 hover:text-red-400 bg-zinc-900/40 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded-xl transition-all" 
                    title="Delete Car"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="p-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-wider">No luxury vehicles found matching criteria.</div>
        )}
      </div>

      {/* Confirmation Modal: Are you sure you want to delete? */}
      {vehicleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Backdrop */}
          <div 
            onClick={() => !isDeleting && setVehicleToDelete(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
          />
          
          {/* Modal Container */}
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => !isDeleting && setVehicleToDelete(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 mx-auto sm:mx-0">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <div className="text-center sm:text-left space-y-2">
                <h3 className="text-lg font-serif font-bold text-white tracking-wider uppercase">
                  Delete Inventory Vehicle
                </h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  Are you sure you want to permanently delete this vehicle from your showroom inventory?
                </p>
                
                {/* Vehicle Card Preview */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 flex items-center gap-3.5 text-left mt-3">
                  <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 bg-zinc-900 shrink-0">
                    <AdminTableRowImage imgUrl={vehicleToDelete.images?.[0]} alt={`${vehicleToDelete.make} ${vehicleToDelete.model}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans font-bold text-white text-sm truncate">
                      {vehicleToDelete.year} {vehicleToDelete.make} {vehicleToDelete.model}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-zinc-400">
                        {vehicleToDelete.registration || 'No Reg. No'}
                      </span>
                      <span className="text-xs font-sans font-bold text-[#00C0FF]">
                        {formatPrice(vehicleToDelete.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider pt-1">
                  ⚠️ This action cannot be undone. All photos and details will be deleted.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setVehicleToDelete(null)}
                  className="flex-1 px-4 py-3 bg-zinc-900/50 hover:bg-zinc-800/80 border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-bold tracking-widest font-mono uppercase transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold tracking-widest font-mono uppercase transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminTableRowImage({ imgUrl, alt }: { imgUrl?: string; alt: string }) {
  const fallback = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";
  const { displayUrl } = useRenderableImage(imgUrl || fallback);
  return (
    <img 
      src={displayUrl || fallback} 
      alt={alt} 
      className="w-full h-full object-cover" 
    />
  );
}
