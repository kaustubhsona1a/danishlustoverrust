import { Star, X, ChevronLeft, ChevronRight, Maximize2, MapPin, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { MOCK_REVIEWS } from '../data/mockData';
import React, { useState } from 'react';

export default function About() {
  const { siteConfig } = useVehicles();
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const deliveries = siteConfig.clientDeliveries || [];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deliveries.length === 0) return;
    setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % deliveries.length : 0));
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deliveries.length === 0) return;
    setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + deliveries.length) % deliveries.length : 0));
  };

  return (
    <div className="bg-transparent text-zinc-300 font-sans min-h-screen">
      {/* Client Deliveries Section */}
      <section className="pt-32 pb-24 bg-transparent relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-20 animate-fade-in">
            <span className="text-[#E1306C] tracking-[0.25em] uppercase text-xs font-bold mb-3 block font-mono">
              MOMENTS OF JOY
            </span>
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold text-white tracking-widest uppercase mb-4">
              MEMORIES <span className="text-[#00C0FF]">ON</span> THE <span className="text-[#32CD32]">ROAD</span>
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto leading-relaxed font-light">
              Real, candid snapshots of happy keys and vehicle handovers outside our Boutique. Feel the legacy we've built, one smile at a time!
            </p>
          </div>

          {/* Majestic Polaroid Style Photo Wall */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pt-6">
            {deliveries.map((img, i) => {
              // Custom list of happy delivery captions centered on the joyous milestone
              const captions = [
                "🔑 Happy delivery!",
                "✨ Happy delivery!",
                "🚗 Happy delivery!",
                "🌟 Happy delivery!",
                "🖤 Happy delivery!",
                "🔥 Happy delivery!"
              ];

              // Clean high-luxury offset angles mimicking a realistic pinned physical photo collage wall
              const rotations = [
                '-rotate-1.5 hover:rotate-0',
                'rotate-2 hover:rotate-0',
                '-rotate-2 hover:rotate-0',
                'rotate-1.5 hover:rotate-0',
                '-rotate-1 hover:rotate-0',
                'rotate-2.5 hover:rotate-0'
              ];

              const currentRotation = rotations[i % rotations.length];
              const currentCaption = captions[i % captions.length];

              return (
                <div 
                  key={i} 
                  id={`patron-card-${i}`}
                  onClick={() => setActivePhotoIndex(i)}
                  className={`group relative bg-[#fbfbf9] p-5 pb-7 rounded-none border border-stone-200/60 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between text-stone-800 ${currentRotation} hover:scale-103 hover:-translate-y-2.5 hover:z-20`}
                >
                  {/* Absolute Pinned Gold tape clip overlaying the top boundary */}
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-4 ${i % 2 === 0 ? 'bg-[#E1306C]/35 border border-[#E1306C]/20' : 'bg-[#00C0FF]/35 border border-[#00C0FF]/20'} backdrop-blur-[0.5px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] z-10 rotate-1 select-none`} />

                  {/* Photo Canvas Frame inside Polaroid - aspect-[12/13] to increase width while preserving length */}
                  <div className="relative overflow-hidden border border-stone-200 bg-stone-100 aspect-[12/13] w-full">
                    <img 
                      src={img} 
                      alt={`Client Delivery ${i + 1}`} 
                      className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-all duration-750 ease-out"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800" }}
                    />
                    
                    {/* Dark inner shadow frame for that photopaper depth feel */}
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_3px_10px_rgba(0,0,0,0.15)]" />

                    {/* Green Slant "APPROVED" stamp badge like the reference */}
                    <div className="absolute top-3 right-3 bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-mono text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded backdrop-blur-sm shadow-sm select-none">
                      ✓ APPROVED
                    </div>
                  </div>

                  {/* Polaroid handwritten-style caption */}
                  <div className="pt-5 text-center px-1">
                    <p className="font-serif text-stone-800 text-[14px] md:text-[15px] font-medium italic tracking-wide select-none">
                      {currentCaption}
                    </p>
                  </div>

                  {/* Mono styled physical tag footer */}
                  <div className="mt-4 pt-3 border-t border-dashed border-stone-200/90 flex justify-between items-center text-[9px] font-mono font-bold tracking-wider text-zinc-400 select-none">
                    <span>ESTD. 1986</span>
                    <span>MUMBAI, MH</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Modern Cinematic Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div 
          id="patron-lightbox-backdrop"
          onClick={() => setActivePhotoIndex(null)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-4 md:p-8"
        >
          {/* Top Control Bar */}
          <div className="absolute top-5 inset-x-0 px-6 flex justify-between items-center text-zinc-400 font-mono text-xs z-10 max-w-7xl mx-auto">
            <div>
              <span className="text-[#00C0FF] font-bold">LUST OVER RUST</span>
              <span className="mx-2 font-light">|</span>
              <span>PATRON ARCHIVE {activePhotoIndex + 1} OF {deliveries.length}</span>
            </div>
            
            <button 
              onClick={() => setActivePhotoIndex(null)}
              className="p-3 bg-zinc-900 border border-white/5 rounded-full text-zinc-400 hover:text-white hover:border-[#00C0FF] transition-all flex items-center justify-center cursor-pointer shadow-lg hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Visual Centerpiece */}
          <div className="relative w-full max-w-5xl aspect-[16/10] md:max-h-[70vh] flex items-center justify-center group/lightbox my-auto">
            {/* Navigations inside group */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 p-4 rounded-2xl bg-black/60 border border-white/10 hover:border-[#00C0FF] hover:bg-black/90 text-[#00C0FF] hover:text-white transition-all transform -translate-x-12 opacity-0 group-hover/lightbox:translate-x-0 group-hover/lightbox:opacity-100 z-20 cursor-pointer hidden md:flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img 
              src={deliveries[activePhotoIndex]} 
              alt="Immersive Celebration"
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full max-h-[70vh] object-contain rounded-2xl border border-white/5 shadow-2xl animate-scale-up"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format=crop&q=80&w=800" }}
            />

            <button
              onClick={handleNextPhoto}
              className="absolute right-4 p-4 rounded-2xl bg-black/60 border border-white/10 hover:border-[#00C0FF] hover:bg-black/90 text-[#00C0FF] hover:text-white transition-all transform translate-x-12 opacity-0 group-hover/lightbox:translate-x-0 group-hover/lightbox:opacity-100 z-20 cursor-pointer hidden md:flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Fast-Tapper Overlay controls */}
          <div className="flex md:hidden gap-6 mt-4 z-10">
            <button
               onClick={handlePrevPhoto}
               className="px-6 py-3 rounded-xl bg-zinc-900 border border-white/5 text-[#00C0FF] text-xs font-mono font-bold uppercase tracking-wider"
            >
              PREV ARCHIVE
            </button>
            <button
               onClick={handleNextPhoto}
               className="px-6 py-3 rounded-xl bg-zinc-900 border border-white/5 text-[#00C0FF] text-xs font-mono font-bold uppercase tracking-wider"
            >
              NEXT ARCHIVE
            </button>
          </div>

          {/* Informational Footer */}
          <div className="mt-6 text-center max-w-xl z-10 px-4">
            <p className="text-[#00C0FF] font-mono text-[10px] tracking-[0.3em] uppercase font-bold">MUMBAI DELIVERIES</p>
            <h4 className="text-white font-serif text-xl font-bold mt-1">Acquisition Milestone Celebration</h4>
            <p className="text-zinc-400 text-xs mt-2 font-light leading-relaxed">
              Every photograph is a direct capture of an esteemed patron receiving delivery of their handpicked, verified performance car from our secure boutique gallery at the Vasant Oasis Parking level in Marol Naka, Andheri, Mumbai.
            </p>
          </div>
        </div>
      )}

      {/* Our Heritage & Core Pillars Section */}
      <section className="py-24 bg-transparent border-t border-zinc-900 relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-8 text-left animate-fade-in">
              <div>
                <span className="text-[#32CD32] tracking-[0.3em] uppercase text-xs font-bold mb-3 block font-mono">
                  OUR HERITAGE
                </span>
                <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide font-bold leading-tight uppercase">
                  A Legacy of Trust, Quality & <span className="text-[#32CD32]">Affordable Luxury</span>
                </h2>
              </div>
              
              <div className="space-y-6 text-zinc-400 font-light text-base leading-relaxed">
                <p>
                  Established as an elite destination for connoisseurs of top-tier motoring, our premier pre-owned car dealership has prioritized flawless automotive execution and transparent client relationships above all else. Our highly protected, private vehicle collection is situated safe and secure within the Vasant Oasis Parking level in Marol Naka, Andheri, Mumbai. 
                </p>
                <p>
                  Rather than functioning as a highly commercial public storefront, we've deliberately maintained a private boutique operation inside the building parking. This operational layout dramatically cuts down on excessive commercial retail overheads, enabling us to deliver premium luxury and performance cars to our esteemed buyers at incredibly competitive, affordable rates.
                </p>
                <p>
                  Over the years, we have built a highly loyal, multi-generational clientele among residents of the area and across Mumbai. We specialize strictly in <strong className="text-[#00C0FF] font-medium">clean cars with meticulous history files</strong>. Every single vehicle that is invited into our collection undergoes rigorous vetting—guaranteeing no accidental history, zero water damage, and absolute mechanical precision. From elite sedans and luxury SUVs to raw sports cars, our inventory is crafted for absolute peace of mind.
                </p>
              </div>

              {/* Local Accents Info Cards Row */}
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="border border-zinc-900 bg-zinc-900/65 backdrop-blur-md p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#00C0FF]" />
                    <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider">LOCATION</span>
                  </div>
                  <h4 className="text-sm text-white font-semibold font-sans tracking-wide">
                    <a href="https://www.google.com/maps/place/Brihanmumbai+Municipal+Corporation+Pay+%26+Park/@19.1151861,72.8840714,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9bf040015af:0xadd2c580b2718ba4!8m2!3d19.1151861!4d72.8840714!16s%2Fg%2F11p0blj3vj?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="hover:text-[#00C0FF] transition-colors duration-300">
                      Marol Naka, Andheri
                    </a>
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-light mt-1 animate-pulse">Serving esteemed buyers directly from our secure parking-level boutique gallery.</p>
                </div>

                <div className="border border-zinc-900 bg-zinc-900/65 backdrop-blur-md p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#E1306C]" />
                    <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider">VEHICLE VALUE</span>
                  </div>
                  <h4 className="text-sm text-white font-semibold font-sans tracking-wide">Affordable Rates</h4>
                  <p className="text-[11px] text-zinc-400 font-light mt-1">Lower overheads allow us to pass premium discounts directly to you.</p>
                </div>
              </div>
            </div>

            {/* Right Pillars Panel (Surgical Curation) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-zinc-900/65 border border-zinc-900 p-8 rounded-3xl relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                {/* Glowing subtle gradient mesh background */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#E1306C]/3 rounded-full blur-3xl pointer-events-none" />

                <h3 className="text-white font-serif text-xl font-bold mb-6 tracking-wide border-b border-zinc-800 pb-4">
                  Why Discerning Buyers Choose Us
                </h3>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#00C0FF]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm tracking-wide font-sans">Elaborate Traceable History</h4>
                      <p className="text-zinc-400 text-xs font-light mt-1.5 leading-relaxed">
                        We don't deal in mystery. Every single premium listing is delivered with full, transparent service files, tax certifications, and clear ownership reports.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shrink-0">
                      <Sparkles className="w-5 h-5 text-[#E1306C]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm tracking-wide font-sans">Immaculately Clean Cars</h4>
                      <p className="text-zinc-400 text-xs font-light mt-1.5 leading-relaxed">
                        Each vehicle undergoes extensive cosmetic detailing and systematic computer diagnostic testing before being admitted to our collection.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shrink-0">
                      <Award className="w-5 h-5 text-[#32CD32]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm tracking-wide font-sans">Uncompromising Quality</h4>
                      <p className="text-zinc-400 text-xs font-light mt-1.5 leading-relaxed">
                        Our team brings years of expert curatorial experience to selecting high-quality premium luxury assets, offering unrivaled standards at highly affordable price points.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-transparent border-t border-zinc-900 font-sans relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <span className="text-[#E1306C] tracking-[0.2em] uppercase text-xs font-semibold mb-3 block font-mono">Unbiased Endorsements</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide mb-4">Google Business Ratings</h2>
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto tracking-widest font-mono text-[9px] uppercase font-bold">
              Direct verification from our esteemed client community across Mumbai.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_REVIEWS.map((review, i) => {
              const hoverBorders = [
                "hover:border-[#00C0FF]/40 hover:shadow-lg hover:shadow-[#00C0FF]/5",
                "hover:border-[#E1306C]/40 hover:shadow-lg hover:shadow-[#E1306C]/5",
                "hover:border-[#32CD32]/40 hover:shadow-lg hover:shadow-[#32CD32]/5"
              ];
              const starColors = ["text-[#00C0FF]", "text-[#E1306C]", "text-[#32CD32]"];
              const initialColors = ["text-[#00C0FF] border-[#00C0FF]/20", "text-[#E1306C] border-[#E1306C]/20", "text-[#32CD32] border-[#32CD32]/20"];

              return (
                <div key={i} className={`bg-zinc-900/65 border border-zinc-900/80 p-8 rounded-2xl flex flex-col h-full transition-all duration-300 shadow-sm justify-between ${hoverBorders[i % 3]}`}>
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-current text-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-300 font-light italic leading-relaxed mb-8">"{review.text}"</p>
                  </div>
                  <div className="flex items-center pt-4 border-t border-zinc-800 gap-4 font-mono">
                    <div className={`w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center font-bold text-base border ${initialColors[i % 3]}`}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm tracking-wide">{review.name}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{review.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-transparent text-center border-t border-zinc-900 relative z-10 animate-fade-in">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-5 tracking-wide">Experience Ultimate Procurement</h2>
          <p className="text-zinc-400 mb-10 font-light tracking-wide text-lg">We welcome you to our secure, private bypass showroom at the Vasant Oasis Parking level in Marol Naka, Andheri, Mumbai, to inspect our pristine, handpicked stock offline.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-xs tracking-widest uppercase font-mono font-bold">
            <Link to="/inventory" className="bg-[#E1306C] hover:bg-zinc-900 text-white px-10 py-4 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#E1306C]/15">
              Browse Collection
            </Link>
            <a href="/#contact" className="bg-zinc-900 text-zinc-300 hover:bg-zinc-855 px-10 py-4 transition-all duration-300 rounded-xl border border-zinc-800 shadow-sm">
              Contact Our Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

