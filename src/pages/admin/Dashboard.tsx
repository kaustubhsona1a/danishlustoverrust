import { Car, Users, TrendingUp, IndianRupee, Plus, CarFront, Settings, ArrowRight } from 'lucide-react';
import { useVehicles } from '../../context/VehicleContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { vehicles, leads } = useVehicles();
  const activeCars = vehicles.filter(v => v.status === 'Available').length;
  const soldCars = vehicles.filter(v => v.status === 'Sold').length;
  const newLeadsCount = leads.filter(l => l.status === 'New Lead').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-widest uppercase">Dealer Dashboard</h1>
          <p className="text-zinc-400 text-xs mt-1.5 font-mono uppercase tracking-wider">Quick actions & showroom management.</p>
        </div>
      </div>

      {/* 3 Simple Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Action 1: Upload a Car */}
        <Link 
          to="/dealer-management/inventory/add" 
          className="group bg-zinc-950/70 hover:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-[#00C0FF]/40 transition-all duration-300 shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#00C0FF]/10 border border-[#00C0FF]/25 flex items-center justify-center text-[#00C0FF] group-hover:scale-105 group-hover:bg-[#00C0FF] group-hover:text-zinc-950 transition-all duration-300 mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-serif font-bold text-white uppercase tracking-wider mb-1">Upload a Car</h2>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">Add a new luxury vehicle listing with photos, specs, and price.</p>
          </div>
          <div className="mt-6 flex items-center text-xs font-mono font-bold text-[#00C0FF] group-hover:text-white uppercase tracking-wider">
            <span>Add Vehicle Now</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Action 2: View Full Inventory */}
        <Link 
          to="/dealer-management/inventory" 
          className="group bg-zinc-950/70 hover:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-[#00C0FF]/40 transition-all duration-300 shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#00C0FF]/10 border border-[#00C0FF]/25 flex items-center justify-center text-[#00C0FF] group-hover:scale-105 group-hover:bg-[#00C0FF] group-hover:text-zinc-950 transition-all duration-300 mb-4">
              <CarFront className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-serif font-bold text-white uppercase tracking-wider">Full Inventory</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00C0FF]/10 text-[#00C0FF] border border-[#00C0FF]/20">
                {activeCars} Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">View, edit, mark sold, or manage all vehicle listings in your showroom.</p>
          </div>
          <div className="mt-6 flex items-center text-xs font-mono font-bold text-[#00C0FF] group-hover:text-white uppercase tracking-wider">
            <span>Manage Inventory</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Action 3: Site Settings */}
        <Link 
          to="/dealer-management/settings" 
          className="group bg-zinc-950/70 hover:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-[#00C0FF]/40 transition-all duration-300 shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#00C0FF]/10 border border-[#00C0FF]/25 flex items-center justify-center text-[#00C0FF] group-hover:scale-105 group-hover:bg-[#00C0FF] group-hover:text-zinc-950 transition-all duration-300 mb-4">
              <Settings className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-serif font-bold text-white uppercase tracking-wider mb-1">Site Settings</h2>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">Update hero banner photos, showroom logo, Instagram reels, & deliveries.</p>
          </div>
          <div className="mt-6 flex items-center text-xs font-mono font-bold text-[#00C0FF] group-hover:text-white uppercase tracking-wider">
            <span>Customize Site</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

      {/* Empty Database Banner if 0 cars */}
      {vehicles.length === 0 && (
        <div className="bg-[#00C0FF]/10 border border-[#00C0FF]/25 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="space-y-1.5 relative z-10">
            <h3 className="font-serif font-bold text-white text-md uppercase tracking-widest flex items-center gap-2">
              <Car className="w-4 h-4 text-[#00C0FF]" />
              Showroom Inventory Empty
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl font-sans">
              Currently, there are <strong>0 vehicle listings</strong> in your showroom. Click <strong>Upload a Car</strong> above to add your first vehicle listing.
            </p>
          </div>
          <Link to="/dealer-management/inventory/add" className="shrink-0 px-5 py-2.5 bg-[#00C0FF] text-zinc-950 rounded-xl font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors">
            + Upload Car
          </Link>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-zinc-950/65 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-center shadow-lg">
          <div className="bg-[#00C0FF]/10 w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 border border-[#00C0FF]/25 shrink-0">
            <Car className="w-5 h-5 text-[#00C0FF]" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">Active Cars</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">{activeCars}</p>
          </div>
        </div>

        <div className="bg-zinc-950/65 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-center shadow-lg">
          <div className="bg-[#E1306C]/10 w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 border border-[#E1306C]/25 shrink-0">
            <TrendingUp className="w-5 h-5 text-[#E1306C]" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">Cars Sold</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">{soldCars}</p>
          </div>
        </div>

        <div className="bg-zinc-950/65 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-center shadow-lg">
          <div className="bg-[#00C0FF]/10 w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 border border-[#00C0FF]/25 shrink-0">
            <Users className="w-5 h-5 text-[#00C0FF]" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">New Leads</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">{newLeadsCount}</p>
          </div>
        </div>

        <div className="bg-zinc-950/65 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-center shadow-lg">
          <div className="bg-[#32CD32]/10 w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 border border-[#32CD32]/25 shrink-0">
            <IndianRupee className="w-5 h-5 text-[#32CD32]" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">Total Inquiries</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">{leads.length}</p>
          </div>
        </div>

      </div>

      {/* Recent Leads */}
      <div className="bg-zinc-950/65 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="font-serif font-bold text-white text-base sm:text-lg tracking-widest uppercase">Recent Buyer & Valuation Inquiries</h2>
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-wider mt-0.5">Direct leads submitted via website</p>
          </div>
          <Link to="/dealer-management/leads" className="text-xs text-[#00C0FF] hover:text-white font-semibold font-mono uppercase tracking-wider transition-colors flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="p-0">
          {leads.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 font-mono text-xs uppercase tracking-wider">No customer inquiries yet.</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#00C0FF]/5 text-[#00C0FF] text-[10px] uppercase font-bold tracking-widest font-mono border-b border-white/5">
                    <tr>
                      <th className="px-6 py-3.5">Customer Name</th>
                      <th className="px-6 py-3.5">Interest / Vehicle Details</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-250">
                    {leads.slice(0, 5).map(lead => (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors font-mono">
                        <td className="px-6 py-4 font-sans font-bold text-white">{lead.name}</td>
                        <td className="px-6 py-4 text-zinc-300 max-w-md truncate">{lead.car}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            lead.status === 'New Lead' ? 'bg-[#00C0FF]/10 text-[#00C0FF] border-[#00C0FF]/25' :
                            lead.status === 'Contacted' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' :
                            'bg-zinc-950 text-zinc-500 border-zinc-900'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">{lead.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="block md:hidden divide-y divide-white/5 font-mono text-xs">
                {leads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="p-4 flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-sans font-extrabold text-white text-sm">{lead.name}</span>
                      <span className="text-[9px] text-zinc-500">{lead.date}</span>
                    </div>
                    <div className="text-zinc-300 text-[10px] uppercase tracking-wide truncate">
                      🚘 {lead.car}
                    </div>
                    <div className="pt-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                        lead.status === 'New Lead' ? 'bg-[#00C0FF]/10 text-[#00C0FF] border-[#00C0FF]/25' :
                        lead.status === 'Contacted' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' :
                        'bg-zinc-900 text-zinc-500 border-zinc-900'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

