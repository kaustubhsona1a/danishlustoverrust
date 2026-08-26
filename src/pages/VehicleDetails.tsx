import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { formatPrice } from '../data/mockData';
import { CheckCircle2, ChevronLeft, MapPin, Search, Share2, Copy, Check, X, Mail, Instagram } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useVehicles } from '../context/VehicleContext';
import { Helmet } from 'react-helmet-async';
import PhotoLightbox from '../components/PhotoLightbox';
import { useRenderableImage } from '../lib/imageUtils';

export default function VehicleDetails() {
  const { vehicles, loading } = useVehicles();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const car = vehicles.find(v => v.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Gallery state is synchronized with the browser history via searchParams
  const isGalleryOpen = searchParams.get('gallery') === 'open';

  const handleOpenGallery = (index?: number) => {
    if (typeof index === 'number') {
      setActiveImage(index);
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('gallery', 'open');
        return next;
      },
      { replace: false }
    );
  };

  const handleCloseGallery = () => {
    if (searchParams.get('gallery') === 'open') {
      // Pop the history entry back to the vehicle details page cleanly
      navigate(-1);
    }
  };

  const currentRawUrl = car?.images?.[activeImage] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";
  const { displayUrl: activeImageUrl } = useRenderableImage(currentRawUrl);

  // EMI Calculator State Variables (hooks declared unconditionally)
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [loanAmount, setLoanAmount] = useState<number>(0);

  useEffect(() => {
    if (car) {
      setLoanAmount(Math.round(car.price * 0.8));
    }
  }, [car?.price]);

  const calculateEMI = () => {
    if (!car) return { monthlyEmi: 0, totalInterest: 0, totalPayable: 0 };
    const P = loanAmount || Math.round(car.price * 0.8);
    const r = (interestRate / 12) / 100;
    const n = tenureYears * 12;
    
    let emi = 0;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    
    const monthlyEmi = Math.round(emi);
    const totalPayable = Math.round(monthlyEmi * n);
    const totalInterest = Math.max(0, Math.round(totalPayable - P));
    
    return { monthlyEmi, totalInterest, totalPayable };
  };

  const { monthlyEmi, totalInterest, totalPayable } = calculateEMI();

  if (!car) {
    if (loading) {
      return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-[#00C0FF] font-sans relative">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#00C0FF] mb-4"></div>
          <p className="text-xs uppercase tracking-widest font-mono text-zinc-500 font-bold animate-pulse">Loading Vehicle Details...</p>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-20 text-zinc-650">
        <Helmet>
          <title>Vehicle Not Found | Lust Over Rust</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="text-center font-serif text-2xl font-bold text-zinc-900">Car not found</div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${car.year} ${car.make} ${car.model} (${car.variant}) listed at ${formatPrice(car.price)} on Lust Over Rust website. Please share more details.`);
    window.open(`https://wa.me/917977395815?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:+917977395815`);
  };

  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: pageTitle,
      text: pageDescription,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageTitle = `${car.year} ${car.make} ${car.model} ${car.variant} | Lust Over Rust`;
  const pageDescription = `Exquisite luxury pre-owned ${car.year} ${car.make} ${car.model}. Contact us today to arrange a viewing at our Showroom. ${car.description ? car.description.substring(0, 100) + '...' : ''}`;
  const ogImageUrl = car.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800";

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!car?.images || car.images.length === 0) return;
    setActiveImage((prev) => (prev > 0 ? prev - 1 : car.images.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!car?.images || car.images.length === 0) return;
    setActiveImage((prev) => (prev < car.images.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && elapsed < 500) {
      if (deltaX < 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-750 py-12 font-sans selection:bg-[#00C0FF] selection:text-white z-10 relative">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>
      
      {/* Fullscreen Interactive Zoom Lightbox with Pinch-to-Zoom, Pan, and Swipe */}
      <PhotoLightbox
        images={car.images || []}
        initialIndex={activeImage}
        isOpen={isGalleryOpen}
        onClose={handleCloseGallery}
        title={`${car.year} ${car.make} ${car.model}`}
      />

      <div className="container mx-auto max-w-7xl px-4">
        
        <Link to="/inventory" className="inline-flex items-center text-zinc-500 hover:text-[#00C0FF] uppercase tracking-wider text-xs font-bold mb-8 transition-colors font-mono">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Collection
        </Link>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-12 text-zinc-300">
          
          {/* Left Column - Gallery & Details */}
          <div className="w-full lg:w-2/3 flex flex-col gap-5 md:gap-10">
            {/* Gallery */}
            <div className="space-y-4 shadow-sm rounded-2xl overflow-hidden bg-zinc-900/55 p-3 md:p-4 border border-zinc-900/80 backdrop-blur-md">
              <div 
                className="relative h-[40vh] sm:h-[45vh] md:h-[55vh] overflow-hidden bg-zinc-950/40 rounded-xl group border border-zinc-800/80 cursor-pointer select-none"
                onClick={() => handleOpenGallery(activeImage)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img 
                  src={activeImageUrl || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"} 
                  alt={car.make} 
                  className="w-full h-full object-contain transition-all duration-300 opacity-95 group-hover:opacity-100" 
                  draggable={false}
                />

                {/* Image Counter Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-zinc-950/80 border border-white/10 text-white font-mono text-[11px] font-bold backdrop-blur-sm shadow-sm">
                    {activeImage + 1} / {car.images?.length || 1}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-4 custom-scrollbar">
                {(car.images || []).map((img, i) => (
                  <VehicleGalleryThumbnail
                    key={img}
                    imgUrl={img}
                    isSelected={activeImage === i}
                    onClick={() => setActiveImage(i)}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Verified Asset / Price Box */}
            <div className="block lg:hidden bg-zinc-900/55 p-5 border border-zinc-900/80 relative rounded-2xl shadow-sm backdrop-blur-md">
              <div className="absolute top-0 right-0 bg-[#00C0FF] text-zinc-950 text-[9px] tracking-widest uppercase font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-2xl font-mono">
                Verified Asset
              </div>
              <h1 className="text-xl font-serif font-bold text-white mt-2 tracking-tight leading-tight">
                {car.make} <span className="font-light text-zinc-400">{car.model}</span>
              </h1>
              <p className="text-[9px] tracking-widest uppercase text-zinc-500 font-mono mt-1 mb-4">{car.variant}</p>
              <div className="text-2xl font-bold text-white mb-3 pb-3 border-b border-zinc-800 font-serif">{formatPrice(car.price)}</div>

              {car.instagramReel && (
                <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#E1306C]/10 to-[#C13584]/5 border border-[#E1306C]/15 flex flex-col gap-2.5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E1306C] text-white">
                      <Instagram className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <p className="text-[9px] font-bold text-[#E1306C] tracking-widest uppercase font-mono">Instagram Reel highlight</p>
                      <p className="text-[8px] text-zinc-500 uppercase tracking-wider font-mono">Watch immersive video review</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(car.instagramReel, '_blank', 'noopener,noreferrer')}
                    className="w-full text-center bg-[#E1306C] hover:bg-white text-white hover:text-zinc-950 font-bold py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-mono transition-all flex items-center justify-center gap-1.5 border border-white/5 shadow-md"
                  >
                    Watch on Instagram ↗
                  </button>
                </div>
              )}
              
              <p className="text-xs tracking-wider text-zinc-400 mb-4 flex items-center font-mono font-semibold">
                <a href="https://www.google.com/maps/place/Brihanmumbai+Municipal+Corporation+Pay+%26+Park/@19.1151861,72.8840714,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9bf040015af:0xadd2c580b2718ba4!8m2!3d19.1151861!4d72.8840714!16s%2Fg%2F11p0blj3vj?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-300 inline-flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#00C0FF]" /> Showroom, Mumbai
                </a>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px] tracking-widest uppercase font-bold">
                <button onClick={handleCall} className="w-full bg-[#00C0FF] hover:bg-white text-zinc-950 py-3 rounded-xl transition-all duration-300 shadow-sm">
                  Call Us
                </button>
                <button onClick={handleWhatsApp} className="w-full bg-[#1faf54] hover:bg-[#189144] text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 12.008 0c3.205.001 6.216 1.25 8.484 3.52 2.268 2.27 3.516 5.283 3.515 8.491-.005 6.655-5.344 12.003-11.95 12.003-.111 0-.221 0-.332-.005l-5.69 2.12c-.22.08-.454.04-.63-.12l-.35-.35zM6.57 17.51l.36.21c1.55.93 3.32 1.42 5.15 1.42a9.92 9.92 0 0 0 9.95-9.94c0-2.65-1.03-5.15-2.9-7.02C17.26 3.2 14.77 2.17 12.1 2.17 6.64 2.17 2.2 6.61 2.2 12.07c0 1.93.53 3.82 1.54 5.43l.23.37-1.01 3.69 3.61-.95zM17.43 14.93c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07a8.1 8.1 0 0 1-2.39-1.48 8.94 8.94 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.61.13-.13.29-.34.44-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.59-.49-.51-.67-.52l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.89 1.22 3.1 1.05 1.41 1.74 1.74 3.1 2.45a9.5 9.5 0 0 0 3.7.8c1.3-.01 2.44-.45 2.74-1 .3-.53.3-1 .22-1.12-.08-.12-.3-.19-.59-.34z"/></svg>
                  WhatsApp
                </button>
                <button onClick={handleShare} className="w-full bg-zinc-950/50 hover:bg-zinc-950 text-[#00C0FF] hover:text-[#00C0FF] border border-zinc-805 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm">
                  <Share2 className="w-3.5 h-3.5" />
                  Share Listing
                </button>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-zinc-900/55 border border-zinc-900 p-5 md:p-10 rounded-2xl shadow-sm space-y-6 md:space-y-8 animate-fade-in backdrop-blur-md">
              <div>
                <h2 className="text-lg md:text-2xl font-serif font-bold text-white mb-5 md:mb-8 border-b border-zinc-800/80 pb-3 md:pb-5">Technical Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-zinc-300">
                  <div className="bg-zinc-950/40 border border-zinc-800/80 p-3 md:p-4 rounded-xl">
                    <p className="text-[11px] tracking-wider uppercase text-zinc-500 mb-1 font-semibold font-sans">Make</p>
                    <p className="text-white font-bold text-xs md:text-base tracking-wide uppercase">{car.make}</p>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-800/80 p-3 md:p-4 rounded-xl">
                    <p className="text-[11px] tracking-wider uppercase text-zinc-500 mb-1 font-semibold font-sans">Model</p>
                    <p className="text-white font-bold text-xs md:text-base tracking-wide uppercase">{car.model}</p>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-800/80 p-3 md:p-4 rounded-xl">
                    <p className="text-[11px] tracking-wider uppercase text-zinc-500 mb-1 font-semibold font-sans">Year</p>
                    <p className="text-white font-bold text-xs md:text-base tracking-wide uppercase font-sans">{car.year}</p>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-800/80 p-3 md:p-4 rounded-xl text-[#00C0FF]">
                    <p className="text-[11px] tracking-wider uppercase text-zinc-500 mb-1 font-semibold font-sans">Mileage</p>
                    <p className="text-[#00C0FF] font-black text-xs md:text-base tracking-wide uppercase font-sans">{car.mileage.toLocaleString()} KM</p>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-800/80 p-3 md:p-4 rounded-xl">
                    <p className="text-[11px] tracking-wider uppercase text-zinc-500 mb-1 font-semibold font-sans">Fuel Type</p>
                    <p className="text-white font-bold text-xs md:text-base tracking-wide uppercase">{car.fuelType}</p>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-800/80 p-3 md:p-4 rounded-xl">
                    <p className="text-[11px] tracking-wider uppercase text-zinc-500 mb-1 font-semibold font-sans">Transmission</p>
                    <p className="text-white font-bold text-xs md:text-base tracking-wide uppercase">{car.transmission}</p>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-800/80 p-3 md:p-4 rounded-xl">
                    <p className="text-[11px] tracking-wider uppercase text-zinc-500 mb-1 font-semibold font-sans">Ownership</p>
                    <p className="text-white font-bold text-xs md:text-base tracking-wide uppercase">{car.ownership}</p>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-800/80 p-3 md:p-4 rounded-xl">
                    <p className="text-[11px] tracking-wider uppercase text-zinc-500 mb-1 font-semibold font-sans">Color</p>
                    <p className="text-white font-bold text-xs md:text-base tracking-wide uppercase">{car.color}</p>
                  </div>
                </div>
              </div>

              {car.description && (
                <div className="border-t border-zinc-800/80 pt-5 md:pt-8">
                  <h3 className="text-xs md:text-sm font-bold font-serif text-[#00C0FF] mb-3 md:mb-4 uppercase tracking-widest">Additional Info</h3>
                  <p className="text-zinc-300 text-xs md:text-sm font-light leading-relaxed whitespace-pre-line font-serif">{car.description}</p>
                </div>
              )}
            </div>

            {/* Certified preowned section */}
            <div className="hidden lg:block bg-zinc-900/55 p-10 border border-zinc-900/80 rounded-2xl relative overflow-hidden group hover:border-[#00C0FF]/40 transition-colors duration-500 shadow-sm backdrop-blur-md">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                <Search className="w-40 h-40 text-[#00C0FF]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mb-3">Certified Pre-Owned Selection</h2>
              <p className="text-zinc-400 mb-6 max-w-xl text-sm font-light leading-relaxed">
                Every vehicle listed by the Lust Over Rust platform undertakes a specialized physical inspection covering diagnostic checks, accident/flood history, mileage validation, and comprehensive ownership verification.
              </p>
            </div>
          </div>          {/* Right Column - Price, Form, EMI */}
          <div className="w-full lg:w-1/3 flex flex-col gap-5 md:gap-8 sticky top-24 self-start">
            
            {/* Price Box */}
            <div className="hidden lg:block bg-zinc-900/55 p-10 border border-zinc-900/80 relative rounded-2xl shadow-sm backdrop-blur-md">
              <div className="absolute top-0 right-0 bg-[#00C0FF] text-zinc-950 text-[10px] tracking-widest uppercase font-bold px-4 py-2 rounded-bl-xl rounded-tr-2xl font-mono">
                Verified Asset
              </div>
              <h1 className="text-3xl font-serif font-bold text-white mt-4 tracking-tight leading-tight">{car.make} <br/><span className="font-light text-zinc-400">{car.model}</span></h1>
              <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-mono mt-3 mb-8">{car.variant}</p>
              <div className="text-3xl font-bold text-white mb-4 pb-6 border-b border-zinc-800 font-serif">{formatPrice(car.price)}</div>

              {car.instagramReel && (
                <div className="mb-8 p-4.5 rounded-2xl bg-gradient-to-r from-[#E1306C]/10 to-[#C13584]/5 border border-[#E1306C]/15 flex flex-col gap-3.5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E1306C] text-white">
                      <Instagram className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-[#E1306C] tracking-widest uppercase font-mono">Instagram Reel highlight</p>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Watch immersive video review</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(car.instagramReel, '_blank', 'noopener,noreferrer')}
                    className="w-full text-center bg-[#E1306C] hover:bg-white text-white hover:text-zinc-950 font-bold py-3.5 rounded-xl text-[10px] uppercase tracking-widest font-mono transition-all flex items-center justify-center gap-2 border border-white/5 shadow-md"
                  >
                    Watch on Instagram ↗
                  </button>
                </div>
              )}
              
              <p className="text-xs tracking-wider text-zinc-400 mb-8 flex items-center font-mono font-semibold">
                <a href="https://www.google.com/maps/place/Brihanmumbai+Municipal+Corporation+Pay+%26+Park/@19.1151861,72.8840714,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9bf040015af:0xadd2c580b2718ba4!8m2!3d19.1151861!4d72.8840714!16s%2Fg%2F11p0blj3vj?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-300 inline-flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-[#00C0FF]" /> Showroom, Mumbai
                </a>
              </p>

              <div className="space-y-4 font-mono text-[11px] tracking-widest uppercase font-bold">
                <button onClick={handleCall} className="w-full bg-[#00C0FF] hover:bg-white text-zinc-950 hover:text-zinc-950 py-4.5 rounded-xl transition-all duration-300 shadow-sm">
                  Call Us Now
                </button>
                <button onClick={handleWhatsApp} className="w-full bg-[#1faf54] hover:bg-[#189144] text-white py-4.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 12.008 0c3.205.001 6.216 1.25 8.484 3.52 2.268 2.27 3.516 5.283 3.515 8.491-.005 6.655-5.344 12.003-11.95 12.003-.111 0-.221 0-.332-.005l-5.69 2.12c-.22.08-.454.04-.63-.12l-.35-.35zM6.57 17.51l.36.21c1.55.93 3.32 1.42 5.15 1.42a9.92 9.92 0 0 0 9.95-9.94c0-2.65-1.03-5.15-2.9-7.02C17.26 3.2 14.77 2.17 12.1 2.17 6.64 2.17 2.2 6.61 2.2 12.07c0 1.93.53 3.82 1.54 5.43l.23.37-1.01 3.69 3.61-.95zM17.43 14.93c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07a8.1 8.1 0 0 1-2.39-1.48 8.94 8.94 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.61.13-.13.29-.34.44-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.59-.49-.51-.67-.52l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.89 1.22 3.1 1.05 1.41 1.74 1.74 3.1 2.45a9.5 9.5 0 0 0 3.7.8c1.3-.01 2.44-.45 2.74-1 .3-.53.3-1 .22-1.12-.08-.12-.3-.19-.59-.34z"/></svg>
                  Shoot WhatsApp Inquiry
                </button>
                <button onClick={handleShare} className="w-full bg-zinc-950/50 hover:bg-zinc-950 text-[#00C0FF] hover:text-[#00C0FF] border border-zinc-805 py-4.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
                  <Share2 className="w-4 h-4" />
                  Share This Listing
                </button>
              </div>
            </div>

            {/* Custom Luxury EMI Calculator */}
            <div className="bg-zinc-900/55 p-5 md:p-8 border border-zinc-900 relative rounded-2xl shadow-sm space-y-4 md:space-y-6 backdrop-blur-md">
              <h2 className="text-sm font-serif font-bold text-white uppercase tracking-widest pb-3 border-b border-zinc-805 flex items-center justify-between">
                <span>EMI ESTIMATE CALCULATOR</span>
                <span className="text-[9px] uppercase tracking-widest font-mono text-zinc-500">Live</span>
              </h2>
              
              {/* Loan Amount Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider font-mono">Loan Amount</label>
                  <span className="text-white font-bold font-sans">{formatPrice(loanAmount || Math.round(car.price * 0.8))}</span>
                </div>
                <input 
                  type="range"
                  min={Math.round(car.price * 0.1)}
                  max={car.price}
                  step={Math.round(car.price * 0.01) || 1000}
                  value={loanAmount || Math.round(car.price * 0.8)}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00C0FF] focus:outline-none focus:ring-1 focus:ring-[#00C0FF]/25"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono tracking-wider uppercase font-semibold">
                  <span>Min {formatPrice(Math.round(car.price * 0.1))} (10%)</span>
                  <span>Max {formatPrice(car.price)}</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider font-mono">Interest Rate</label>
                  <span className="text-[#00C0FF] font-bold font-sans">{interestRate.toFixed(2)}% p.a.</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="20"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00C0FF] focus:outline-none focus:ring-1 focus:ring-[#00C0FF]/20"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono tracking-wider uppercase font-semibold">
                  <span>5.0% Min</span>
                  <span>20.0% Max</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-zinc-400 font-semibold uppercase tracking-wider font-mono">Tenure (Years)</label>
                  <span className="text-[#00C0FF] font-bold font-sans">{tenureYears} {tenureYears === 1 ? 'Year' : 'Years'} ({tenureYears * 12} Months)</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00C0FF] focus:outline-none focus:ring-1 focus:ring-[#00C0FF]/20"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono tracking-wider uppercase font-semibold">
                  <span>1 Year</span>
                  <span>7 Years</span>
                </div>
              </div>

              {/* EMI Output Breakdown */}
              <div className="bg-[#00C0FF]/5 border border-[#00C0FF]/10 rounded-xl p-4 md:p-5 text-center space-y-3 md:space-y-4 shadow-inner relative overflow-hidden">
                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest uppercase text-zinc-455 block font-mono font-bold">Estimated Monthly EMI</span>
                  <span className="text-2xl md:text-3xl font-serif font-extrabold text-white block">{formatPrice(monthlyEmi)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-zinc-805 text-[10px] text-zinc-400 font-mono tracking-wider uppercase font-semibold">
                  <div className="text-left space-y-0.5">
                    <span className="text-zinc-500 text-[9px]">Total Interest</span>
                    <span className="block text-zinc-100 font-sans font-bold text-xs">{formatPrice(totalInterest)}</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-zinc-500 text-[9px]">Total Cost</span>
                    <span className="block text-zinc-100 font-sans font-bold text-xs">{formatPrice(totalPayable)}</span>
                  </div>
                </div>
              </div>

              {/* Legend/Note */}
              <p className="text-[8px] text-zinc-500 font-mono uppercase text-center leading-relaxed">
                *Approximate figures based on standard monthly calculations. Actual loan rates and eligibility might vary according to bank parameters.
              </p>
            </div>
            
          </div>
        </div>

        {/* Certified preowned section - Shifted down for mobile preview */}
        <div className="block lg:hidden mt-8 bg-zinc-900/55 p-5 md:p-10 border border-zinc-900/80 rounded-2xl relative overflow-hidden group hover:border-[#00C0FF]/40 transition-colors duration-500 shadow-sm backdrop-blur-md">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
            <Search className="w-40 h-40 text-[#00C0FF]" />
          </div>
          <h2 className="text-lg md:text-2xl font-serif font-bold text-white mb-2 md:mb-3">Certified Pre-Owned Selection</h2>
          <p className="text-zinc-400 mb-4 md:mb-6 max-w-xl text-sm font-light leading-relaxed">
            Every vehicle listed by the Lust Over Rust platform undertakes a specialized physical inspection covering diagnostic checks, accident/flood history, mileage validation, and comprehensive ownership verification.
          </p>
        </div>
      </div>

      {/* Deluxe Share Listing Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Blur Backdrop */}
          <div 
            onClick={() => setShowShareModal(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
          />
          
          {/* Modal Card */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl text-zinc-300">
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-full bg-zinc-950 border border-zinc-805 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-sm font-serif font-bold text-white tracking-widest uppercase">Share Collection Asset</h3>
                <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase mt-1">Spread the luxury word</p>
              </div>

              {/* Asset Preview info Box */}
              <div className="bg-zinc-950/40 border border-zinc-805 rounded-xl p-4 flex gap-4 items-center">
                <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-zinc-950">
                  <img 
                    src={car.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=100"} 
                    alt={car.make} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-serif font-bold text-white uppercase truncate">{car.year} {car.make}</h4>
                  <p className="text-[9px] text-white font-sans font-bold mt-0.5">{formatPrice(car.price)}</p>
                </div>
              </div>

              {/* Quick links grid */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    const msg = `Check out this gorgeous ${car.year} ${car.make} ${car.model} listed at ${formatPrice(car.price)} on Lust Over Rust!`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg + ' ' + window.location.href)}`, '_blank');
                  }}
                  className="flex flex-col items-center justify-center gap-2 p-3.5 bg-[#1faf54]/5 hover:bg-[#1faf54]/10 border border-[#1faf54]/10 hover:border-[#1faf54]/25 rounded-xl transition-all group"
                >
                  <svg className="w-5 h-5 text-[#1faf54] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.431 2.5 1.157 3.471L6.78 19.83l4.562-1.202c.904.494 1.944.777 3.05.777 3.182 0 5.769-2.587 5.769-5.768 0-3.18-2.587-5.765-5.769-5.765zm3.61 8.18c-.13.364-.75.71-1.042.75-.292.04-.584.07-.876.03-.292-.04-.555-.1-.848-.2-.35-.12-.76-.324-1.21-.58-.876-.496-1.554-1.246-2.05-2.12-.13-.23-.21-.497-.24-.764-.04-.265.03-.526.17-.745.21-.293.447-.648.555-.838.11-.19.16-.31.25-.506.09-.197.05-.373-.02-.52-.07-.146-.62-1.49-.85-2.044-.224-.54-.45-.467-.62-.476l-.527-.008c-.184 0-.482.062-.733.34-.251.278-.962.94-.962 2.292 0 1.353.984 2.658 1.121 2.843.136.185 1.93 2.947 4.673 4.133.653.282 1.162.45 1.56.577.656.208 1.253.179 1.725.109.526-.078 1.62-.662 1.848-1.267.228-.605.228-1.125.16-1.233-.068-.108-.25-.173-.526-.31z"/>
                  </svg>
                  <span className="text-[9px] text-zinc-550 font-mono tracking-wider font-bold uppercase transition-colors group-hover:text-white">WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    const msg = `Check out this gorgeous ${car.year} ${car.make} ${car.model} listed at ${formatPrice(car.price)} on Lust Over Rust!`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                  }}
                  className="flex flex-col items-center justify-center gap-2 p-3.5 bg-[#1da1f2]/5 hover:bg-[#1da1f2]/10 border border-[#1da1f2]/10 hover:border-[#1da1f2]/25 rounded-xl transition-all group"
                >
                  <svg className="w-5 h-5 text-[#1da1f2] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="text-[9px] text-zinc-550 font-mono tracking-wider font-bold uppercase transition-colors group-hover:text-white">Twitter</span>
                </button>

                <button
                  onClick={() => {
                    const subj = `Interested in the ${car.year} ${car.make} ${car.model}`;
                    const body = `Hey, take a look at this exceptional pre-owned ${car.year} ${car.make} ${car.model} listed at ${formatPrice(car.price)} on the Lust Over Rust website: ${window.location.href}`;
                    window.open(`mailto:?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`);
                  }}
                  className="flex flex-col items-center justify-center gap-2 p-3.5 bg-zinc-950/50 hover:bg-zinc-950 border border-zinc-805 rounded-xl transition-all group"
                >
                  <Mail className="w-5 h-5 text-zinc-500 transition-transform group-hover:scale-110" />
                  <span className="text-[9px] text-zinc-555 font-mono tracking-wider font-bold uppercase transition-colors group-hover:text-white">Email</span>
                </button>
              </div>

              {/* Clipboard link copy box */}
              <div className="space-y-2 pt-2 border-t border-zinc-805">
                <label className="text-[9px] font-mono font-bold tracking-widest text-[#00C0FF] uppercase block">Copy Link Reference</label>
                <div className="flex bg-zinc-950 hover:bg-zinc-950 border border-zinc-805 rounded-xl overflow-hidden focus-within:border-[#00C0FF]/35 transition-all">
                  <input 
                    type="text" 
                    readOnly 
                    value={window.location.href}
                    className="flex-1 min-w-0 bg-transparent text-xs text-zinc-500 font-mono px-4 py-3 outline-none"
                  />
                  <button 
                    onClick={handleCopyLink}
                    className={`px-4 flex items-center justify-center gap-1 border-l border-zinc-800 text-xs font-mono font-bold transition-all ${copied ? 'bg-emerald-600/20 text-emerald-700 text-[10px]' : 'bg-[#00C0FF]/5 text-[#4fc3f7] hover:bg-[#00C0FF] hover:text-white uppercase'}`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VehicleGalleryThumbnail({
  imgUrl,
  isSelected,
  onClick
}: {
  key?: React.Key;
  imgUrl: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { displayUrl } = useRenderableImage(imgUrl);

  return (
    <button 
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 w-24 sm:w-32 h-18 sm:h-24 overflow-hidden rounded-xl border transition-all duration-300 ${
        isSelected ? 'border-[#00C0FF] scale-[1.02] opacity-100 shadow-md shadow-[#00C0FF]/15' : 'border-zinc-800 opacity-60 hover:opacity-100'
      }`}
    >
      <img src={displayUrl || imgUrl} alt="Thumbnail" loading="lazy" className="w-full h-full object-cover" />
    </button>
  );
}

