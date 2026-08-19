import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Twitter, Menu, X, Star, Upload, Image, Check, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { useVehicles, sanitizeHeroImage } from '../context/VehicleContext';
import { useAuth } from '../context/AuthContext';

export default function CustomerLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const { siteConfig } = useVehicles();
  const { loginAsDealer } = useAuth();
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Custom multi-tap tracker for dealer console access on mobile (esp. iPhone Safari)
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleSecretLogin = () => {
    loginAsDealer();
    setNotification('Dealer session unlocked. Redirecting to showroom console...');
    setTimeout(() => {
      navigate('/dealer-management');
      setNotification('');
    }, 1500);
  };

  const registerTap = () => {
    const now = Date.now();
    if (now - lastTapTime < 800) {
      const nextCount = tapCount + 1;
      if (nextCount >= 3) {
        handleSecretLogin();
        setTapCount(0);
      } else {
        setTapCount(nextCount);
      }
    } else {
      setTapCount(1);
    }
    setLastTapTime(now);
  };

  const handleCopyrightClick = (e: React.MouseEvent) => {
    // Avoid double triggering if the browser already processed the touch event
    if ('ontouchstart' in window) {
      return;
    }
    registerTap();
  };

  const handleCopyrightTouch = (e: React.TouchEvent) => {
    e.preventDefault(); // crucial to prevent double-tap to zoom or text selection on iOS Safari
    registerTap();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-300 relative bg-transparent">
      {/* Dynamic secret greeting/bypass notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] bg-zinc-900 text-white font-semibold text-xs tracking-widest uppercase font-mono px-8 py-5 rounded-full shadow-2xl border border-zinc-800 flex items-center space-x-3 transition-all animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{notification}</span>
        </div>
      )}

        {/* Global Background - Tailored showcase representation in premium dark theme */}
      <div className="fixed inset-0 z-0 bg-[#02020a] overflow-hidden pointer-events-none">
        {/* Desktop Showcase Backdrop */}
        {sanitizeHeroImage(siteConfig.homeHeroImage) && (
          <img 
            src={sanitizeHeroImage(siteConfig.homeHeroImage)} 
            alt="Lust Over Rust Showcase Backdrop" 
            className={`hidden md:block absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-[1.01] ${
              isHomePage 
                ? (isScrolled ? 'opacity-[0.3] blur-[3px]' : 'opacity-100 blur-none') 
                : 'opacity-[0.32] blur-[3px]'
            }`}
          />
        )}
        {/* Mobile-specific Showcase Backdrop */}
        {sanitizeHeroImage(siteConfig.homeHeroMobileImage || siteConfig.homeHeroImage) && (
          <img 
            src={sanitizeHeroImage(siteConfig.homeHeroMobileImage || siteConfig.homeHeroImage)} 
            alt="Lust Over Rust Showcase Backdrop (Mobile)" 
            className={`block md:hidden absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-[1.01] ${
              isHomePage 
                ? (isScrolled ? 'opacity-[0.3] blur-[3px]' : 'opacity-100 blur-none') 
                : 'opacity-[0.32] blur-[3px]'
            }`}
          />
        )}
        {/* Dynamic black glass overlay to dissolve screen smoothly on scroll */}
        <div className={`absolute inset-0 transition-all duration-700 ${
          isHomePage 
            ? (isScrolled ? 'bg-[#02020a]/70 backdrop-blur-sm' : 'bg-black/10 backdrop-blur-none') 
            : 'bg-[#02020a]/70 backdrop-blur-sm'
        }`} />

        {/* Dynamic bright neon glow pools to prevent dull blackness */}
        <div className="absolute top-[-15%] left-[-10%] w-[65vw] h-[65vw] bg-[#00f0ff]/15 rounded-full blur-[140px] opacity-90 z-2"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[65vw] h-[65vw] bg-[#bf00ff]/15 rounded-full blur-[140px] opacity-90 z-2"></div>
        <div className="absolute top-[35%] right-[10%] w-[45vw] h-[45vw] bg-[#0055ff]/10 rounded-full blur-[120px] opacity-60 z-2"></div>

        {/* Real retro-futuristic bright slanted neon lines mimicking the user reference image exactly */}
        <div className={`absolute inset-0 z-3 overflow-hidden transition-all duration-700 ${
          isHomePage && !isScrolled ? 'opacity-[0.35]' : 'opacity-[0.65]'
        }`}>
          {/* Slanted lines container (-28deg rotation mimicking the image precisely) */}
          <div className="absolute inset-0 transform -rotate-[28deg] scale-[1.3] origin-center">
            {/* Bright Cyan Line */}
            <div className="absolute top-[18%] left-[-30%] right-[-30%] h-[1.5px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_18px_rgba(0,240,255,0.85),0_0_8px_rgba(0,240,255,0.4)]"></div>
            {/* Subtle parallel glow line */}
            <div className="absolute top-[20%] left-[-20%] right-[-20%] h-[1px] bg-gradient-to-r from-transparent via-[#00a8ff]/40 to-transparent"></div>
            
            {/* Bold Neon Purple / Crimson Violet Line representing high contrast */}
            <div className="absolute top-[45%] left-[-30%] right-[-30%] h-[2.5px] bg-gradient-to-r from-transparent via-[#bf00ff] to-transparent shadow-[0_0_22px_rgba(191,0,255,0.9),0_0_10px_rgba(191,0,255,0.5)]"></div>
            
            {/* Bright Cyan Sharp Short Accent right near center of perspective */}
            <div className="absolute top-[68%] left-[10%] w-[65%] h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_20px_rgba(0,240,255,0.9),0_0_9px_rgba(0,240,255,0.5)]"></div>
            
            {/* Dynamic deep indigo helper line */}
            <div className="absolute bottom-[22%] left-[-30%] right-[-30%] h-[1px] bg-gradient-to-r from-transparent via-[#0055ff]/50 to-transparent shadow-[0_0_12px_rgba(0,85,255,0.6)]"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col flex-grow min-h-screen">
        {/* Main Navbar */}
        <nav className={`sticky top-0 z-50 border-b transition-all duration-500 ${
          isHomePage 
            ? (isScrolled ? 'bg-zinc-950/90 backdrop-blur-md border-zinc-900/60 shadow-sm text-zinc-100' : 'bg-transparent border-transparent text-white') 
            : 'bg-zinc-950/90 backdrop-blur-md border-zinc-900/60 shadow-sm text-zinc-100'
        }`}>
          <div className="container mx-auto max-w-7xl px-4 py-5 flex justify-between items-center">
            
            {/* Left Side: Branding Text & Logo */}
            <Link to="/" className="flex items-center space-x-1.5 shrink-0 select-none">
              {siteConfig.logo ? (
                <img src={siteConfig.logo} alt="Lust Over Rust" className="h-6 sm:h-8 w-auto object-contain" />
              ) : null}
              <span className="text-[9px] min-[360px]:text-[10.5px] md:text-sm font-serif font-black tracking-widest uppercase transition-all duration-300 whitespace-nowrap font-bold text-white">
                LUST OVER RUST
              </span>
            </Link>

            {/* Right/Middle Side: Desktop Navigation & Social Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
              
              {/* Desktop Contact & Socials */}
              <div className="hidden md:flex items-center space-x-4">
                <a href="tel:+917977395815" className="flex items-center text-xs font-semibold tracking-wider transition-colors duration-300 font-mono text-zinc-300 hover:text-[#00C0FF]">
                  <Phone className="w-4 h-4 text-[#00C0FF] mr-2" />
                  <span>+91 79773 95815</span>
                </a>
              <div className="flex items-center space-x-4 border-l pl-4 border-zinc-800">
                <a href="https://www.instagram.com/lustoverrustpvtltd/" target="_blank" rel="noreferrer" className="text-[#E1306C] hover:opacity-80 transition-all duration-300" title="Instagram">
                   <Instagram className="w-4 h-4 text-[#E1306C]" />
                </a>
                <a href="https://wa.me/917977395815" target="_blank" rel="noreferrer" className="text-[#25D366] hover:opacity-80 transition-all duration-300" title="WhatsApp Assistant">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </a>
                <a href="https://www.google.com/maps/place/Brihanmumbai+Municipal+Corporation+Pay+%26+Park/@19.1151861,72.8840714,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9bf040015af:0xadd2c580b2718ba4!8m2!3d19.1151861!4d72.8840714!16s%2Fg%2F11p0blj3vj?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="flex items-center transition-colors duration-300 text-zinc-400 hover:text-[#FFB800]" title="Mumbai Showroom">
                  <MapPin className="w-4 h-4 text-[#FFB800]" />
                  <span className="hidden lg:inline text-[9px] tracking-wider uppercase font-mono pl-1.5 font-bold">Mumbai</span>
                </a>
              </div>
            </div>

            {/* Mobile Contact & Socials (Icon Only, No Full Number shown) */}
            <div className="flex md:hidden items-center space-x-3 pr-2 border-r border-zinc-800 text-zinc-400">
              <a href="tel:+917977395815" className="hover:text-[#00C0FF] transition-all duration-300" title="Call Us">
                <Phone className="w-[18px] h-[18px] text-[#00C0FF]" />
              </a>
              <a href="https://www.instagram.com/lustoverrustpvtltd/" target="_blank" rel="noreferrer" className="text-[#E1306C] hover:opacity-80 transition-all duration-300" title="Instagram">
                <Instagram className="w-[18px] h-[18px] text-[#E1306C]" />
              </a>
              <a href="https://wa.me/917977395815" target="_blank" rel="noreferrer" className="text-[#25D366] hover:opacity-80 transition-all duration-300" title="WhatsApp Chat">
                <MessageCircle className="w-[18px] h-[18px] text-[#25D366] fill-[#25D366]/10" />
              </a>
              <a href="https://www.google.com/maps/place/Brihanmumbai+Municipal+Corporation+Pay+%26+Park/@19.1151861,72.8840714,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9bf040015af:0xadd2c580b2718ba4!8m2!3d19.1151861!4d72.8840714!16s%2Fg%2F11p0blj3vj?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="hover:text-[#FFB800] transition-all duration-300" title="Mumbai Showroom">
                <MapPin className="w-[18px] h-[18px] text-[#FFB800]" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 text-[13px] font-medium tracking-wide">
              <Link to="/" className={`transition-all duration-300 ${
                location.pathname === '/' 
                  ? 'text-[#00c0ff] font-bold border-b border-[#00c0ff]/30' 
                  : 'text-zinc-300 hover:text-[#00C0FF]'
              }`}>Home</Link>
              <Link to="/inventory" className={`transition-all duration-300 ${
                location.pathname.startsWith('/inventory') 
                  ? 'text-[#00c0ff] font-bold border-b border-[#00c0ff]/30' 
                  : 'text-zinc-300 hover:text-[#00C0FF]'
              }`}>Showroom</Link>
              <Link to="/sell" className={`transition-all duration-300 ${
                location.pathname === '/sell' 
                  ? 'text-[#00c0ff] font-bold border-b border-[#00c0ff]/30' 
                  : 'text-zinc-300 hover:text-[#00C0FF]'
              }`}>Sell Your Car</Link>
              <Link to="/about" className={`transition-all duration-300 ${
                location.pathname === '/about' 
                  ? 'text-[#00c0ff] font-bold border-b border-[#00c0ff]/30' 
                  : 'text-zinc-300 hover:text-[#00C0FF]'
              }`}>About</Link>
              <a href="#contact" className="text-zinc-300 hover:text-[#00C0FF] transition-all duration-300">Contact</a>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-1.5 transition-colors duration-300 focus:outline-none text-zinc-400 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 px-4 py-8 flex flex-col space-y-6 font-semibold tracking-widest uppercase font-mono shadow-2xl">
            <Link to="/" onClick={closeMenu} className="text-zinc-300 hover:text-[#00C0FF]">Home</Link>
            <Link to="/inventory" onClick={closeMenu} className="text-zinc-300 hover:text-[#00C0FF]">Showroom</Link>
            <Link to="/sell" onClick={closeMenu} className="text-zinc-300 hover:text-[#00C0FF]">Sell Your Car</Link>
            <Link to="/about" onClick={closeMenu} className="text-zinc-300 hover:text-[#00C0FF]">About</Link>
            <a href="#contact" onClick={closeMenu} className="text-zinc-300 hover:text-[#00C0FF]">Contact Us</a>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-transparent border-t border-zinc-900/40 text-zinc-400 pt-24 pb-12 px-4 mt-20 relative overflow-hidden">
        {/* Ambient Subtle background purple/blue pulse */}
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#E1306C]/3 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10 text-zinc-300">
          <div className="space-y-6 md:col-span-1">
            <div className="flex items-center inline-flex mb-4">
              <img 
                src={siteConfig.logo} 
                alt="Lust Over Rust" 
                className="h-10 w-auto object-contain mr-3 max-w-[150px]" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden flex-col items-start2 nv-logo-text">
                <h1 className="text-lg font-serif tracking-widest leading-none font-bold uppercase text-white">
                  <span className="text-[#E1306C]">LUST</span> <span className="text-[#FF2E2E]">OVER</span> <span className="text-[#32CD32]">RUST</span>
                </h1>
                <p className="text-[8px] uppercase tracking-[0.5em] text-zinc-500 font-mono mt-1 font-bold">EST. 2026</p>
              </div>
            </div>
            <p className="text-sm tracking-wide leading-relaxed text-zinc-400 font-light">
              Driven By Passion. Defined By Quality.<br/>
              Mumbai-based automotive company focused on premium pre-owned vehicles, enthusiast-focused experiences and transparent transactions.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-serif tracking-widest text-xs font-black uppercase text-[#00C0FF] border-b border-zinc-900 pb-2">Quick Links</h3>
            <ul className="space-y-3.5 text-xs tracking-widest uppercase font-semibold font-mono text-zinc-400">
              <li><Link to="/inventory" className="hover:text-white transition-colors duration-300">Browse Collection</Link></li>
              <li><Link to="/sell" className="hover:text-white transition-colors duration-300">Sell Your Car</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors duration-300">About Us</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-serif tracking-widest text-xs font-black uppercase text-[#00C0FF] border-b border-zinc-900 pb-2">Support Info</h3>
            <ul className="space-y-4 text-sm tracking-wide text-zinc-400 font-light">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-[#00C0FF] mr-3 shrink-0 mt-1" />
                <a href="https://www.google.com/maps/place/Brihanmumbai+Municipal+Corporation+Pay+%26+Park/@19.1151861,72.8840714,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9bf040015af:0xadd2c580b2718ba4!8m2!3d19.1151861!4d72.8840714!16s%2Fg%2F11p0blj3vj?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-300 leading-relaxed font-light text-zinc-400">
                  Vasant Oasis Parking, Marol Naka, Andheri, Mumbai, Maharashtra, India
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-[#00C0FF] mr-3 shrink-0" />
                <a href="tel:+917977395815" className="hover:text-white transition-colors duration-300 font-mono">+91 79773 95815</a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-[#00C0FF] mr-3 shrink-0" />
                <a href="mailto:Lustoverrustpvtltd@gmail.com" className="hover:text-white transition-colors duration-300 font-mono font-bold">Lustoverrustpvtltd@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl mt-20 pt-8 border-t border-zinc-900 text-[10px] tracking-widest uppercase text-zinc-500 flex flex-col md:flex-row justify-between items-center font-mono font-semibold">
          <p 
            onClick={handleCopyrightClick}
            onTouchStart={handleCopyrightTouch}
            role="button"
            tabIndex={0}
            className="select-none text-zinc-500 cursor-pointer touch-manipulation hover:text-white outline-none active:text-white transition-colors"
          >
            &copy; {new Date().getFullYear()} Lust Over Rust Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-zinc-500">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white flex items-center">Terms</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
