import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Banknote, FileText, Star, MapPin, Phone, Car, Gauge, Fuel, Cog, Settings2, Compass, ExternalLink, Instagram, Video } from 'lucide-react';
import { formatPrice, MOCK_REVIEWS } from '../data/mockData';
import { useVehicles } from '../context/VehicleContext';
import { Helmet } from 'react-helmet-async';

const CARD_THEMES = [
  {
    glow: "hover:border-[#00C0FF]/70 hover:shadow-xl hover:shadow-[#00C0FF]/10",
    textHover: "group-hover:text-[#00C0FF]",
    price: "text-white",
    badge: "text-[#00C0FF] border-[#00C0FF]/25 bg-zinc-950/90 shadow-sm",
    btn: "group-hover:border-[#00C0FF] group-hover:text-zinc-950 group-hover:bg-white group-hover:shadow-sm",
    icon: "text-[#00C0FF]",
    border: "border-zinc-850 hover:border-[#00C0FF]/65"
  },
  {
    glow: "hover:border-[#E1306C]/70 hover:shadow-xl hover:shadow-[#E1306C]/10",
    textHover: "group-hover:text-[#E1306C]",
    price: "text-white",
    badge: "text-[#E1306C] border-[#E1306C]/25 bg-zinc-950/90 shadow-sm",
    btn: "group-hover:border-[#E1306C] group-hover:text-zinc-950 group-hover:bg-white group-hover:shadow-sm",
    icon: "text-[#E1306C]",
    border: "border-zinc-850 hover:border-[#E1306C]/65"
  },
  {
    glow: "hover:border-[#FF2E2E]/70 hover:shadow-xl hover:shadow-[#FF2E2E]/10",
    textHover: "group-hover:text-[#FF2E2E]",
    price: "text-white",
    badge: "text-[#FF2E2E] border-[#FF2E2E]/25 bg-zinc-950/90 shadow-sm",
    btn: "group-hover:border-[#FF2E2E] group-hover:text-zinc-950 group-hover:bg-white group-hover:shadow-sm",
    icon: "text-[#FF2E2E]",
    border: "border-zinc-850 hover:border-[#FF2E2E]/65"
  },
  {
    glow: "hover:border-[#32CD32]/70 hover:shadow-xl hover:shadow-[#32CD32]/10",
    textHover: "group-hover:text-[#32CD32]",
    price: "text-white",
    badge: "text-[#32CD32] border-[#32CD32]/25 bg-zinc-950/90 shadow-sm",
    btn: "group-hover:border-[#32CD32] group-hover:text-zinc-950 group-hover:bg-white group-hover:shadow-sm",
    icon: "text-[#32CD32]",
    border: "border-zinc-850 hover:border-[#32CD32]/65"
  }
];

export default function Home() {
  const { vehicles, siteConfig, loading } = useVehicles();
  const featuredCars = vehicles.filter(v => v.status === 'Available').slice(0, 3);
  
  const siteUrl = "https://lustoverrust.com";
  const defaultDesc = "Lust Over Rust Pvt. Ltd. | Explore premium pre-owned vehicles at Mumbai's premier enthusiast showroom. Quality inventory, transparent pricing and an enthusiast-focused buying experience.";

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-zinc-300 font-sans">
      <Helmet>
        <title>Lust Over Rust Pvt. Ltd. | Premium Pre-Owned Cars Mumbai</title>
        <meta name="description" content={defaultDesc} />
        <meta property="og:title" content="Lust Over Rust Pvt. Ltd. | Premium Pre-Owned Cars Mumbai" />
        <meta property="og:description" content={defaultDesc} />
        <meta property="og:image" content={siteConfig.homeHeroImage} />
        <meta property="og:url" content={siteUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero Space - Empty to let backdrop show cleanly */}
      <section className="relative h-[68vh] sm:h-[66vh] lg:h-[72vh] flex items-center justify-center overflow-hidden">
        {/* Completely empty space as requested by user to showcase background photo */}
      </section>

      {/* Featured Inventory */}
      <section className="pt-8 pb-24 bg-transparent relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-zinc-900 pb-8">
            <div>
              <span className="text-[#FF2E2E] tracking-[0.2em] uppercase text-xs font-semibold mb-2 block font-mono">Fresh Stock</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight font-bold">Featured Collection</h2>
            </div>
            <Link to="/inventory" className="hidden md:flex items-center text-[#00C0FF] hover:text-white transition-colors tracking-widest uppercase text-xs font-bold font-mono">
              View Entire Collection <ArrowRight className="w-4 h-4 ml-3 text-[#00C0FF]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map((num) => (
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
            ) : featuredCars.length > 0 ? (
              featuredCars.map((car, idx) => {
                const theme = CARD_THEMES[idx % CARD_THEMES.length];
                return (
                  <Link key={car.id} to={`/inventory/${car.id}`} className="group block h-full">
                    <div className={`bg-zinc-900/55 border ${theme.border} ${theme.glow} backdrop-blur-md transition-all duration-500 flex flex-col h-full overflow-hidden hover:-translate-y-1.5 rounded-2xl shadow-sm hover:shadow-md`}>
                      <div className="relative aspect-[4/3] md:aspect-auto md:h-64 overflow-hidden bg-zinc-950/20">
                        <img src={car.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"} alt={`${car.make} ${car.model}`} loading="lazy" className="w-full h-full object-cover sm:object-contain bg-zinc-950/10 transition-transform duration-1000 group-hover:scale-[1.02] opacity-95" />
                        <div className={`absolute top-4 left-4 text-xs font-extrabold tracking-widest font-mono border py-1 px-3 rounded-lg ${theme.badge}`}>
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
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className={`text-xl font-serif font-bold text-white ${theme.textHover} transition-colors mb-1.5`}>{car.make} <span className="font-light text-zinc-400">{car.model}</span></h3>
                              <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-mono">{car.variant}</p>
                            </div>
                          </div>
                          <div className={`text-xl font-extrabold mb-6 font-sans ${theme.price}`}>
                            {formatPrice(car.price)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-semibold text-zinc-300 mb-6 border-t border-zinc-800/80 pt-5 font-sans">
                            <div className="flex items-center"><Gauge className={`w-4 h-4 mr-2 ${theme.icon}`} /> {car.mileage.toLocaleString()} KM</div>
                            <div className="flex items-center"><Fuel className={`w-4 h-4 mr-2 ${theme.icon}`} /> {car.fuelType}</div>
                            <div className="flex items-center"><Cog className={`w-4 h-4 mr-2 ${theme.icon}`} /> {car.transmission}</div>
                            <div className="flex items-center"><Settings2 className="w-4 h-4 mr-2 text-zinc-500" /> {car.engine}</div>
                          </div>
                          
                          <div className={`w-full text-center border py-2.5 uppercase tracking-widest text-[9px] font-bold rounded-xl transition-all duration-300 bg-zinc-950/50 text-zinc-400 border-zinc-900 font-mono ${theme.btn}`}>
                            View Details
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full border border-white/5 bg-zinc-900/10 rounded-2xl py-12 px-6 text-center font-mono uppercase text-xs tracking-widest text-zinc-500">
                Showroom collection is currently being curated. Check back soon or visit our Instagram.
              </div>
            )}
          </div>
          <div className="mt-12 text-center md:hidden font-mono uppercase text-xs tracking-widest font-bold">
            <Link to="/inventory" className="block bg-[#E1306C] text-white py-4 rounded-xl">
              View Entire Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-transparent relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[#32CD32] tracking-[0.2em] uppercase text-xs font-bold mb-4 block font-mono">Certified Quality Standards</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight font-bold">Uncompromising Assurance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: ShieldCheck, title: "Rigorous Checks", desc: "Every car in our catalog undergoes rigorous multi-point mechanical, structural, and aesthetic certification.", iconColor: "text-[#00C0FF]", titleColor: "text-[#00C0FF]", borderColor: "group-hover:border-[#00C0FF]/35" },
              { icon: Banknote, title: "Transparent Pricing", desc: "Accurate, upfront, and completely transparent market pricing ensures fair, clean, and pressure-free value.", iconColor: "text-[#E1306C]", titleColor: "text-[#E1306C]", borderColor: "group-hover:border-[#E1306C]/35" },
              { icon: Car, title: "Custom Financing", desc: "Custom auto loan structures via leading banking and finance partners.", iconColor: "text-[#32CD32]", titleColor: "text-[#32CD32]", borderColor: "group-hover:border-[#32CD32]/35" },
              { icon: FileText, title: "Pristine Transfer", desc: "Complete oversight and physical management of all ownership paperwork, RTO clearances, and transfers.", iconColor: "text-zinc-400", titleColor: "text-zinc-400", borderColor: "group-hover:border-zinc-800" }
            ].map((feature, i) => (
              <div key={i} className="text-center font-sans group">
                <div className={`w-16 h-16 bg-zinc-900/55 border border-zinc-900 ${feature.borderColor} group-hover:bg-zinc-950 transition-all flex items-center justify-center mx-auto mb-6 rounded-2xl shadow-sm backdrop-blur-md`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className={`text-xs font-bold tracking-widest ${feature.titleColor} mb-3 uppercase font-mono`}>{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-transparent animate-fade-in relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-serif text-white tracking-tight font-bold">Client Testimonials</h2>
            <div className="w-24 h-[1px] bg-gradient-to-r from-[#00C0FF] via-[#E1306C] to-[#32CD32] mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {MOCK_REVIEWS.map((review, i) => {
              const hoverBorders = [
                "hover:border-[#00C0FF]/40 hover:shadow-lg hover:shadow-[#00C0FF]/5",
                "hover:border-[#E1306C]/40 hover:shadow-lg hover:shadow-[#E1306C]/5",
                "hover:border-[#32CD32]/40 hover:shadow-lg hover:shadow-[#32CD32]/5"
              ];
              const starColors = ["text-[#00C0FF]", "text-[#E1306C]", "text-[#32CD32]"];
              
              return (
                <div key={review.id} className={`bg-zinc-900/55 border border-zinc-900 p-8 rounded-2xl flex flex-col justify-between h-full transition-all duration-300 shadow-sm backdrop-blur-md ${hoverBorders[i % 3]}`}>
                  <div>
                    <div className="flex mb-6 space-x-1">
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current text-amber-500" />
                      ))}
                    </div>
                    <p className="text-zinc-300 italic text-base leading-relaxed mb-8 flex-grow">"{review.text}"</p>
                  </div>
                  <div className="border-t border-zinc-800 pt-5 flex justify-between items-center font-mono">
                    <div>
                      <p className="font-sans font-bold text-white uppercase tracking-wider text-xs mb-1">{review.name}</p>
                      <p className="text-[10px] text-[#00C0FF] tracking-wider">{review.date}</p>
                    </div>
                    <span className="text-[10px] bg-[#32CD32]/10 text-[#32CD32] font-bold px-2.5 py-0.5 rounded border border-[#32CD32]/15">Verified</span>
                  </div>
                </div>
              );
            })}
          </div>

          
        </div>
      </section>

      {/* Instagram Reels Showcase Section */}
      {siteConfig.instagramReels && siteConfig.instagramReels.length > 0 && (
        <section className="py-24 bg-transparent relative z-10 border-t border-zinc-900/40">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <span className="text-[#E1306C] tracking-[0.2em] uppercase text-xs font-bold mb-3 block font-mono">Social Showcase</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight font-bold">Featured Instagram Highlights</h2>
              <div className="w-24 h-[1px] bg-gradient-to-r from-[#E1306C] via-[#00C0FF] to-[#32CD32] mx-auto mt-4"></div>
              <p className="text-zinc-[400] text-xs mt-3 uppercase tracking-wider font-mono">
                Interactive video reels direct from our linked{" "}
                <a 
                  href="https://www.instagram.com/lustoverrustpvtltd/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#E1306C] underline hover:text-white transition-all font-bold"
                >
                  @lustoverrustpvtltd
                </a>{" "}
                channel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
              {siteConfig.instagramReels.map((url, idx) => {
                const match = url.match(/(?:\/p\/|\/reel\/|\/tv\/)([A-Za-z0-9_-]+)/);
                const reelId = match ? match[1] : null;
                
                if (!reelId) return null;

                const themeColors = [
                  "border-[#00C0FF]/10 hover:border-[#00C0FF]/30",
                  "border-[#E1306C]/10 hover:border-[#E1306C]/30",
                  "border-[#32CD32]/10 hover:border-[#32CD32]/30"
                ];

                return (
                  <div key={idx} className={`border bg-zinc-900/35 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl hover:shadow-black/55 transition-all duration-300 ${themeColors[idx % themeColors.length]}`}>
                    <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-zinc-950/60 shadow-inner">
                      <iframe 
                        src={`https://www.instagram.com/reel/${reelId}/embed`}
                        className="absolute inset-0 w-full h-full border-0 rounded-xl"
                        allowTransparency={true}
                        allow="encrypted-media"
                        scrolling="no"
                      />
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between font-mono text-[9px] text-zinc-500 uppercase tracking-widest px-1">
                      <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-[#E1306C]" /> Reel #{idx + 1}</span>
                      <a href={url} target="_blank" rel="noreferrer" className="text-[#E1306C] hover:text-white flex items-center gap-1 font-bold">
                        PLAY ON APP <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 flex flex-col justify-center items-center bg-transparent border-t border-zinc-900/40 relative overflow-hidden z-10">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#00C0FF]/3 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#E1306C]/3 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
 
        <div className="w-full max-w-4xl flex flex-col justify-center px-8 text-center relative z-10">
          <span className="text-[#00C0FF] tracking-[0.2em] uppercase text-xs font-bold mb-4 block font-mono">Our Showroom</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white font-bold mb-16 tracking-tight">Visit Us In-Person</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="flex flex-col items-center bg-zinc-900/55 p-10 rounded-2xl border border-zinc-900 hover:border-[#00C0FF]/50 transition-all duration-500 shadow-sm hover:shadow-md backdrop-blur-md text-zinc-300">
              <div className="bg-[#00C0FF]/10 p-4 rounded-full mb-6">
                <MapPin className="w-8 h-8 text-[#00C0FF]" />
              </div>
              <h3 className="font-sans tracking-widest text-[11px] uppercase text-zinc-500 mb-4 font-mono font-bold">Showroom Address</h3>
              <p className="text-zinc-300 text-base leading-relaxed tracking-wide font-light">
                Vasant Oasis Parking,<br/>
                Marol Naka, Andheri,<br/>
                Mumbai, Maharashtra 400059
              </p>
              <a 
                href="https://www.google.com/maps/place/Brihanmumbai+Municipal+Corporation+Pay+%26+Park/@19.1151861,72.8840714,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9bf040015af:0xadd2c580b2718ba4!8m2!3d19.1151861!4d72.8840714!16s%2Fg%2F11p0blj3vj?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noreferrer" 
                className="mt-8 text-[#00C0FF] hover:text-white text-xs tracking-widest uppercase font-mono border-b border-[#00C0FF]/40 hover:border-white pb-1 transition-all inline-flex items-center gap-2"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="flex flex-col items-center bg-zinc-900/55 p-10 rounded-2xl border border-zinc-900 hover:border-[#00C0FF]/50 transition-all duration-500 shadow-sm hover:shadow-md backdrop-blur-md text-zinc-300">
              <div className="bg-[#00C0FF]/10 p-4 rounded-full mb-6">
                <Phone className="w-8 h-8 text-[#00C0FF]" />
              </div>
              <h3 className="font-sans tracking-widest text-[11px] uppercase text-zinc-500 mb-4 font-mono font-bold">Contact Us</h3>
              <a href="tel:+917977395815" className="text-zinc-200 text-2xl tracking-wide hover:text-[#00C0FF] transition-all font-mono font-bold my-auto">+91 79773 95815</a>
              <a 
                href="tel:+917977395815" 
                className="mt-8 text-[#00C0FF] hover:text-white text-xs tracking-widest uppercase font-mono border-b border-[#00C0FF]/40 hover:border-white pb-1 transition-all"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
