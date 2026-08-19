import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/mockData';
import { Search, Filter, Car, Gauge, Fuel, Cog, Instagram } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

export default function Inventory() {
  const { vehicles, loading } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const BUDGET_OPTIONS = [
    1000000,  // Below 10L
    1500000,  // Under 15L
    2000000,  // Under 20L
    2500000,  // Under 25L
    3000000,  // Under 30L
    3500000,  // Under 35L
    4000500,  // Under 40L
    4500000,  // Under 45L
    5000000,  // Under 50L
    100000000 // 50 Lakh+ / Any
  ];
  const [budgetIndex, setBudgetIndex] = useState(BUDGET_OPTIONS.length - 1);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [maxMileage, setMaxMileage] = useState<number>(150000);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredCars = useMemo(() => {
    let result = vehicles.filter(car => car.status === 'Available');
    
    // Search filter
    if (searchTerm) {
      result = result.filter(car => 
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Budget filter
    const currentMaxBudget = BUDGET_OPTIONS[budgetIndex];
    result = result.filter(car => car.price <= currentMaxBudget);

    // Owners filter
    if (selectedOwners.length > 0) {
      result = result.filter(car => {
        if (!car.ownership) return false;
        const carStr = car.ownership.toLowerCase().trim();
        return selectedOwners.some(sel => {
          const selStr = sel.toLowerCase().trim();
          const selShort = selStr.replace(' owner', '').trim();
          const carShort = carStr.replace(' owner', '').trim();
          return carStr === selStr || carShort === selShort || carStr.includes(selShort) || selStr.includes(carShort);
        });
      });
    }

    // Transmission filter
    if (selectedTransmissions.length > 0) {
      result = result.filter(car => selectedTransmissions.includes(car.transmission));
    }

    // Mileage filter
    result = result.filter(car => car.mileage <= maxMileage);
    
    // Fuel type filter
    if (selectedFuelTypes.length > 0) {
      result = result.filter(car => selectedFuelTypes.includes(car.fuelType));
    }
    
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'mileage') {
      result.sort((a, b) => a.mileage - b.mileage);
    }
    
    return result;
  }, [vehicles, searchTerm, sortBy, budgetIndex, selectedOwners, selectedTransmissions, maxMileage, selectedFuelTypes]);

  const toggleOwner = (owner: string) => {
    setSelectedOwners(prev => prev.includes(owner) ? prev.filter(o => o !== owner) : [...prev, owner]);
  };

  const toggleTransmission = (transmission: string) => {
    setSelectedTransmissions(prev => prev.includes(transmission) ? prev.filter(t => t !== transmission) : [...prev, transmission]);
  };

  const toggleFuel = (fuel: string) => {
    setSelectedFuelTypes(prev => prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]);
  };

  const resetFilters = () => {
    setBudgetIndex(BUDGET_OPTIONS.length - 1);
    setSelectedOwners([]);
    setSelectedTransmissions([]);
    setMaxMileage(150000);
    setSelectedFuelTypes([]);
    setSearchTerm('');
    setSortBy('newest');
  };

  const ALL_OWNERS = ['1st Owner', '2nd Owner', '3rd Owner', '4th+ Owner', '1st', '2nd', '3rd', '4th+']; // Match formats
  const ALL_TRANSMISSIONS = ['Automatic', 'Manual'];
  const ALL_FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'];

  return (
    <div className="min-h-screen bg-transparent text-zinc-300 py-12 font-sans z-10 relative">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-zinc-900 pb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-white tracking-widest uppercase">Our Collection</h1>
            <p className="text-zinc-400 mt-2 tracking-widest uppercase text-[10px] font-mono font-bold">Explore <span className="text-[#32CD32]">{filteredCars.length}</span> Verified Motorcars in <span className="text-[#E1306C]">Mumbai</span></p>
          </div>
          
          <div className="flex w-full md:w-auto gap-4 font-mono text-xs">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00C0FF]" />
              <input 
                type="text" 
                placeholder="SEARCH BRAND OR MODEL..." 
                className="w-full pl-11 pr-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs tracking-wider uppercase text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#00C0FF] focus:bg-zinc-950/80 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-zinc-900/60 border border-zinc-800 text-xs tracking-wider text-zinc-300 uppercase rounded-xl px-4 py-4 outline-none focus:border-[#00C0FF] focus:bg-zinc-950/80 transition-colors hidden md:block shadow-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest" className="bg-zinc-950">Newest Inventory</option>
              <option value="price-low" className="bg-zinc-950">Price: Low to High</option>
              <option value="price-high" className="bg-zinc-950">Price: High to Low</option>
              <option value="mileage" className="bg-zinc-950">Mileage: Low to High</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 font-mono">
          <button 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center justify-between w-full p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-300 font-bold tracking-wider text-xs uppercase hover:border-[#00C0FF] transition-colors shadow-sm"
          >
            <div className="flex items-center"><Filter className="w-4 h-4 mr-3 text-[#00C0FF]" /> Showroom Filters</div>
            <span className="text-[10px] text-[#00C0FF] lowercase">{isMobileFiltersOpen ? 'collapse' : 'expand'}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <div className={`w-full lg:w-72 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="p-8 border border-zinc-905 bg-zinc-900/40 backdrop-blur-md rounded-2xl shadow-sm sticky top-28">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-805">
                <h3 className="font-serif tracking-widest text-[#00C0FF] flex items-center uppercase text-xs font-bold font-mono"><Filter className="w-4 h-4 mr-3 text-[#00C0FF]" /> Filters</h3>
                <button onClick={resetFilters} className="text-[9px] tracking-widest uppercase text-zinc-400 hover:text-[#00C0FF] transition-colors font-bold font-mono">Reset</button>
              </div>
              
              <div className="space-y-8 text-zinc-300">
                {/* Budget */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] uppercase tracking-wider text-zinc-450 font-bold font-mono">Max Budget</h4>
                    <span className="text-[11px] text-[#E1306C] tracking-wider font-bold font-mono">
                      {budgetIndex === 0
                        ? 'Below ₹ 10 Lakh'
                        : budgetIndex === BUDGET_OPTIONS.length - 1
                          ? '50 Lakh+'
                          : `Under ₹ ${(BUDGET_OPTIONS[budgetIndex] / 100000).toFixed(0)} Lakh`}
                    </span>
                  </div>
                  <div className="px-2">
                    <input 
                      type="range" 
                      min="0" 
                      max={BUDGET_OPTIONS.length - 1} 
                      step="1"
                      value={budgetIndex} 
                      onChange={(e) => setBudgetIndex(parseInt(e.target.value))}
                      className="w-full accent-[#E1306C] h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Owners */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-450 mb-4 font-bold font-mono border-b border-zinc-805 pb-1.5 flex items-center justify-between">
                    <span>Ownership</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#32CD32] animate-pulse"></span>
                  </h4>
                  <div className="space-y-3">
                    {['1st Owner', '2nd Owner', '3rd Owner'].map(owner => {
                      const isSelected = selectedOwners.includes(owner);
                      return (
                        <label key={owner} className="flex items-center space-x-3 cursor-pointer group">
                          <div className={`relative flex items-center justify-center w-4 h-4 rounded border transition-colors ${isSelected ? 'border-[#32CD32] bg-[#32CD32]' : 'border-zinc-700 group-hover:border-[#32CD32]'}`}>
                              <input 
                                type="checkbox" 
                                className="opacity-0 absolute inset-0 cursor-pointer" 
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedOwners(prev => prev.filter(o => o !== owner));
                                  } else {
                                    setSelectedOwners(prev => [...prev, owner]);
                                  }
                                }}
                              />
                              {isSelected ? <div className="w-1.5 h-1.5 bg-zinc-950 rounded-full"></div> : null}
                          </div>
                          <span className={`text-xs tracking-wide transition-colors ${isSelected ? 'text-white font-semibold' : 'text-zinc-400 group-hover:text-white'}`}>{owner}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-450 mb-4 font-bold font-mono border-b border-zinc-805 pb-1.5 flex items-center justify-between">
                    <span>Transmission</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C] animate-pulse"></span>
                  </h4>
                  <div className="space-y-3">
                    {ALL_TRANSMISSIONS.map(trans => {
                      const isSelected = selectedTransmissions.includes(trans);
                      return (
                        <label key={trans} className="flex items-center space-x-3 cursor-pointer group">
                          <div className={`relative flex items-center justify-center w-4 h-4 rounded border transition-colors ${isSelected ? 'border-[#E1306C] bg-[#E1306C]' : 'border-zinc-700 group-hover:border-[#E1306C]'}`}>
                              <input 
                                type="checkbox" 
                                className="opacity-0 absolute inset-0 cursor-pointer" 
                                checked={isSelected}
                                onChange={() => toggleTransmission(trans)}
                              />
                              {isSelected ? <div className="w-1.5 h-1.5 bg-zinc-950 rounded-full"></div> : null}
                          </div>
                          <span className={`text-xs tracking-wide transition-colors ${isSelected ? 'text-white font-semibold' : 'text-zinc-400 group-hover:text-white'}`}>{trans}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Mileage slider */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] uppercase tracking-wider text-zinc-450 font-bold font-mono">Max Mileage</h4>
                    <span className="text-[11px] text-[#E1306C] tracking-wider font-semibold font-mono">{maxMileage.toLocaleString()} KM</span>
                  </div>
                  <div className="px-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="200000" 
                      step="5000"
                      value={maxMileage} 
                      onChange={(e) => setMaxMileage(parseInt(e.target.value))}
                      className="w-full accent-[#E1306C] h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Fuel Types */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-zinc-450 mb-4 font-bold font-mono border-b border-zinc-805 pb-1.5 flex items-center justify-between">
                    <span>Fuel Type</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C0FF] animate-pulse"></span>
                  </h4>
                  <div className="space-y-3">
                    {ALL_FUELS.map(fuel => {
                      const isSelected = selectedFuelTypes.includes(fuel);
                      return (
                        <label key={fuel} className="flex items-center space-x-3 cursor-pointer group">
                          <div className={`relative flex items-center justify-center w-4 h-4 rounded border transition-colors ${isSelected ? 'border-[#00C0FF] bg-[#00C0FF]' : 'border-zinc-700 group-hover:border-[#00C0FF]'}`}>
                              <input 
                                type="checkbox" 
                                className="opacity-0 absolute inset-0 cursor-pointer" 
                                checked={isSelected}
                                onChange={() => toggleFuel(fuel)}
                              />
                              {isSelected ? <div className="w-1.5 h-1.5 bg-zinc-950 rounded-full"></div> : null}
                          </div>
                          <span className={`text-xs tracking-wide transition-colors ${isSelected ? 'text-white font-semibold' : 'text-zinc-400 group-hover:text-white'}`}>{fuel}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Listing Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading ? (
                [1, 2, 3, 4].map((num) => (
                  <div key={num} className="bg-zinc-900/35 border border-zinc-900/50 rounded-2xl p-6 h-[460px] animate-pulse flex flex-col justify-between">
                    <div className="w-full h-56 bg-zinc-950/40 rounded-xl mb-6"></div>
                    <div className="space-y-4 flex-grow">
                      <div className="h-6 w-2/3 bg-zinc-950/40 rounded-md"></div>
                      <div className="h-4 w-1/3 bg-zinc-950/40 rounded-md"></div>
                      <div className="h-5 w-1/2 bg-zinc-950/40 rounded-md mt-4"></div>
                    </div>
                    <div className="h-10 w-full bg-zinc-950/40 rounded-xl mt-6"></div>
                  </div>
                ))
              ) : filteredCars.length > 0 ? (
                filteredCars.map((car, idx) => {
                  const cardHoverStyles = [
                    "hover:border-[#00C0FF]/60 hover:shadow-xl hover:shadow-[#00C0FF]/5",
                    "hover:border-[#E1306C]/60 hover:shadow-xl hover:shadow-[#E1306C]/5",
                    "hover:border-[#32CD32]/60 hover:shadow-xl hover:shadow-[#32CD32]/5"
                  ];
                  const textHoverStyles = [
                    "group-hover:text-[#00C0FF]",
                    "group-hover:text-[#E1306C]",
                    "group-hover:text-[#32CD32]"
                  ];
                  const buttonTextStyles = [
                    "text-[#00C0FF] hover:text-[#E1306C]",
                    "text-[#E1306C] hover:text-[#32CD32]",
                    "text-[#32CD32] hover:text-[#00C0FF]"
                  ];
                  
                  const hoverStyle = cardHoverStyles[idx % 3];
                  const textHoverStyle = textHoverStyles[idx % 3];
                  const buttonTextStyle = buttonTextStyles[idx % 3];

                  return (
                    <Link key={car.id} to={`/inventory/${car.id}`} className="group block h-full">
                      <div className={`bg-zinc-900/55 border border-zinc-900/80 backdrop-blur-md ${hoverStyle} transition-all duration-500 flex flex-col h-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md`}>
                        <div className="relative aspect-[4/3] sm:aspect-video md:aspect-auto md:h-64 overflow-hidden bg-zinc-950/20 animate-fade-in">
                          <img src={car.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"} alt={`${car.make} ${car.model}`} loading="lazy" className="w-full h-full object-contain bg-zinc-950/10 transition-transform duration-1000 group-hover:scale-[1.02] opacity-95" />
                          <div className="absolute top-4 left-4 bg-zinc-950/90 text-[#32CD32] border border-zinc-800 px-3 py-1 rounded-lg text-xs font-bold tracking-widest font-mono shadow-sm">
                            {car.year}
                          </div>
                          {car.instagramReel && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(car.instagramReel, '_blank', 'noopener,noreferrer');
                              }}
                              className="absolute top-4 right-4 bg-[#E1306C] hover:bg-white text-white hover:text-zinc-950 border border-white/10 px-3 py-1 rounded-lg text-[9px] font-bold tracking-widest font-mono shadow-md transition-all flex items-center gap-1.5 z-10"
                            >
                              <Instagram className="w-3.5 h-3.5 animate-pulse" /> WATCH REEL
                            </button>
                          )}
                        </div>
                        <div className="p-8 flex-grow flex flex-col justify-between text-zinc-300">
                          <div>
                            <div className="mb-4 text-center">
                              <h3 className={`text-xl font-serif font-bold text-white ${textHoverStyle} transition-colors mb-2`}>{car.make} <span className="font-light text-zinc-400">{car.model}</span></h3>
                              <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-mono">{car.variant}</p>
                            </div>
                            <div className="text-2xl font-bold text-center text-white mb-6 pb-6 border-b border-zinc-800/80 font-serif">{formatPrice(car.price)}</div>
                          </div>
                          
                          <div>
                            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs md:text-sm font-semibold text-zinc-300 mb-6 font-sans">
                              <div className="flex items-center"><Gauge className="w-4 h-4 mr-1.5 text-[#E1306C]" /> {car.mileage.toLocaleString()} KM</div>
                              <div className="flex items-center"><Fuel className="w-4 h-4 mr-1.5 text-[#00C0FF]" /> {car.fuelType}</div>
                              <div className="flex items-center"><Cog className="w-4 h-4 mr-1.5 text-[#32CD32]" /> {car.transmission}</div>
                            </div>
                            
                            <div className={`w-full uppercase tracking-widest ${buttonTextStyle} text-[9px] font-bold text-center group-hover:tracking-[0.15em] transition-all duration-500 py-3 border border-zinc-800 bg-zinc-950/50 rounded-xl font-mono`}>
                              Explore specs & registry ↗
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full border border-white/5 bg-zinc-900/10 rounded-2xl py-16 px-6 text-center font-mono uppercase text-xs tracking-widest text-[#FF2E2E]">
                  No matching luxury vehicles found in the active showroom inventory.
                </div>
              )}
            </div>
            
            {filteredCars.length > 0 && (
              <div className="mt-16 flex justify-center border-t border-zinc-900 pt-12">
                 <div className="flex items-center space-x-4">
                     <button className="px-5 py-2.5 border border-zinc-800 rounded-xl text-zinc-400 text-xs tracking-wider uppercase hover:border-[#00C0FF] hover:text-[#00C0FF] disabled:opacity-35 transition-colors font-bold font-mono" disabled>Previous</button>
                     <span className="text-zinc-500 text-xs tracking-widest font-mono">1 / 1</span>
                     <button className="px-5 py-2.5 border border-zinc-800 rounded-xl text-zinc-400 text-xs tracking-wider uppercase hover:border-[#00C0FF] hover:text-[#00C0FF] disabled:opacity-35 transition-colors font-bold font-mono" disabled>Next</button>
                 </div>
              </div>
            )}
            
            {filteredCars.length === 0 && (
              <div className="text-center py-24 border border-zinc-800 bg-zinc-900/55 rounded-2xl flex flex-col items-center shadow-sm">
                <div className="w-16 h-16 border border-zinc-800 bg-zinc-950/30 rounded-2xl flex items-center justify-center mb-4">
                  <Car className="w-6 h-6 text-zinc-450" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-1">No Motorcars Found</h3>
                <p className="text-zinc-500 uppercase tracking-widest text-[9px] font-mono font-bold">Please refine your filter limits</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
