import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

interface PhotoLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function PhotoLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title
}: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const lastTapTime = useRef<number>(0);
  const touchStartPos = useRef<{ x: number; y: number; time: number } | null>(null);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
    }
  }, [isOpen, initialIndex]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handlePrev = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length, resetZoom]);

  const handleNext = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length, resetZoom]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose, resetZoom]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Touch Handlers for Swipe and Pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };

      if (scale > 1) {
        setIsDragging(true);
        dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
      }
    } else if (e.touches.length === 2) {
      // Pinch gesture start
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      lastTouchDistance.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      // Handle Pinch to Zoom
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const factor = dist / lastTouchDistance.current;
      setScale((prev) => {
        const next = Math.min(Math.max(prev * factor, 1), 4);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
      lastTouchDistance.current = dist;
    } else if (e.touches.length === 1 && scale > 1 && isDragging) {
      // Pan when zoomed in
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.current.x,
        y: touch.clientY - dragStart.current.y
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    lastTouchDistance.current = null;
    setIsDragging(false);

    // Check for double tap to toggle zoom
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      if (scale > 1) {
        resetZoom();
      } else {
        setScale(2.5);
      }
      lastTapTime.current = 0;
      return;
    }
    lastTapTime.current = now;

    // Check for horizontal swipe if not zoomed in
    if (scale === 1 && touchStartPos.current && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartPos.current.x;
      const deltaY = touch.clientY - touchStartPos.current.y;
      const elapsed = now - touchStartPos.current.time;

      // Ensure horizontal swipe > 45px and mostly horizontal
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && elapsed < 500) {
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartPos.current = null;
  };

  // Mouse Drag to Pan when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none touch-none animate-fadeIn"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent z-20">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-[#00C0FF]/15 border border-[#00C0FF]/30 text-[#00C0FF] text-xs font-mono font-bold rounded-full">
            {currentIndex + 1} / {images.length}
          </span>
          {title && (
            <span className="text-white text-xs sm:text-sm font-serif uppercase tracking-wider hidden sm:inline truncate max-w-md">
              {title}
            </span>
          )}
          {scale > 1 && (
            <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900/80 px-2 py-0.5 rounded border border-white/10">
              {Math.round(scale * 100)}% Zoom
            </span>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 font-mono">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {scale > 1 && (
            <button
              type="button"
              onClick={resetZoom}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-[#00C0FF] hover:text-white border border-[#00C0FF]/30 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 ml-2 rounded-xl bg-zinc-900/80 hover:bg-red-600/80 text-zinc-300 hover:text-white border border-white/10 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div 
        className="relative flex-grow flex items-center justify-center overflow-hidden p-2 sm:p-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        {/* Left Arrow Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-3 sm:left-6 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-zinc-950/70 hover:bg-[#00C0FF] text-white hover:text-zinc-950 border border-white/10 hover:border-transparent flex items-center justify-center transition-all shadow-xl backdrop-blur-md"
            title="Previous Image (Left Arrow / Swipe Right)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Scalable Image */}
        <div 
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
          }}
          onClick={(e) => {
            if (scale === 1) {
              setScale(2.5);
            }
          }}
        >
          <img
            src={currentImage}
            alt={title || `Vehicle Photo ${currentIndex + 1}`}
            className="max-w-[92vw] max-h-[72vh] object-contain rounded-lg shadow-2xl pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Right Arrow Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-3 sm:right-6 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-zinc-950/70 hover:bg-[#00C0FF] text-white hover:text-zinc-950 border border-white/10 hover:border-transparent flex items-center justify-center transition-all shadow-xl backdrop-blur-md"
            title="Next Image (Right Arrow / Swipe Left)"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Mobile Swipe / Pinch Hint Badge */}
        {scale === 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-zinc-950/80 border border-white/10 text-zinc-400 text-[10px] font-mono tracking-wider uppercase pointer-events-none backdrop-blur-sm shadow-md flex items-center gap-1.5">
            <span>👈 Swipe left/right • Double-tap to zoom 🔍</span>
          </div>
        )}
      </div>

      {/* Bottom Thumbnails Carousel */}
      {images.length > 1 && (
        <div className="p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 overflow-x-auto custom-scrollbar flex items-center justify-center gap-2 sm:gap-3">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => {
                setCurrentIndex(i);
                resetZoom();
              }}
              className={`flex-shrink-0 w-14 sm:w-20 h-10 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                currentIndex === i
                  ? 'border-[#00C0FF] scale-105 opacity-100 shadow-md shadow-[#00C0FF]/30'
                  : 'border-white/10 opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
