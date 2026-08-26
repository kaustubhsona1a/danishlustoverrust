import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';
import { useRenderableImage } from '../lib/imageUtils';

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
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [dragDownOffset, setDragDownOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Gesture tracking refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pinchStartRef = useRef<{ dist: number; scale: number } | null>(null);
  const panStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const isDraggingMouse = useRef(false);
  const mouseStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({ x: 0, y: 0, posX: 0, posY: 0 });

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
      setSwipeOffset(0);
      setDragDownOffset(0);
    }
  }, [isOpen, initialIndex]);

  const resetZoom = useCallback(() => {
    setIsTransitioning(true);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setTimeout(() => setIsTransitioning(false), 250);
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
    setIsTransitioning(true);
    setScale((prev) => Math.min(prev + 0.6, 4));
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleZoomOut = () => {
    setIsTransitioning(true);
    setScale((prev) => {
      const next = Math.max(prev - 0.6, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
    setTimeout(() => setIsTransitioning(false), 200);
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

  // Touch Handlers for Swipe Left/Right, Pull-Down-to-Dismiss, and Pure Pinch-to-Zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };

      if (scale > 1) {
        panStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          posX: position.x,
          posY: position.y
        };
      }
    } else if (e.touches.length === 2) {
      // 2 fingers: Pinch Gesture Start
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartRef.current = { dist, scale };
      touchStartRef.current = null;
      panStartRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartRef.current) {
      // Natural 2-Finger Pinch Zooming
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = currentDist / pinchStartRef.current.dist;
      const targetScale = Math.min(Math.max(pinchStartRef.current.scale * ratio, 0.9), 4.5);
      
      setScale(targetScale);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];

      if (scale > 1 && panStartRef.current) {
        // Pan when zoomed in
        const deltaX = touch.clientX - panStartRef.current.x;
        const deltaY = touch.clientY - panStartRef.current.y;
        setPosition({
          x: panStartRef.current.posX + deltaX,
          y: panStartRef.current.posY + deltaY
        });
      } else if (scale === 1 && touchStartRef.current) {
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        // Determine if pulling down (dismiss) or swiping left/right (next/prev)
        if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
          // Pull down to dismiss
          setDragDownOffset(deltaY);
          setSwipeOffset(0);
        } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Swipe left/right
          setSwipeOffset(deltaX);
          setDragDownOffset(0);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    // If pinch finished, snap scale if below threshold
    if (pinchStartRef.current) {
      if (scale <= 1.08) {
        resetZoom();
      } else if (scale > 4) {
        setIsTransitioning(true);
        setScale(4);
        setTimeout(() => setIsTransitioning(false), 200);
      }
      pinchStartRef.current = null;
    }

    panStartRef.current = null;

    // Check pull-down dismiss
    if (scale === 1 && dragDownOffset > 0) {
      if (dragDownOffset > 85) {
        onClose();
        setDragDownOffset(0);
        touchStartRef.current = null;
        return;
      }
    }

    // Check horizontal swipe navigation
    if (scale === 1 && touchStartRef.current) {
      const elapsed = Date.now() - touchStartRef.current.time;
      const isFastFlick = elapsed < 350 && Math.abs(swipeOffset) > 30;
      const isLargeDrag = Math.abs(swipeOffset) > 70;

      if (isFastFlick || isLargeDrag) {
        if (swipeOffset < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }

    setIsTransitioning(true);
    setSwipeOffset(0);
    setDragDownOffset(0);
    setTimeout(() => setIsTransitioning(false), 200);
    touchStartRef.current = null;
  };

  // Mouse Drag to Pan when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      isDraggingMouse.current = true;
      mouseStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingMouse.current && scale > 1) {
      const deltaX = e.clientX - mouseStartRef.current.x;
      const deltaY = e.clientY - mouseStartRef.current.y;
      setPosition({
        x: mouseStartRef.current.posX + deltaX,
        y: mouseStartRef.current.posY + deltaY
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingMouse.current = false;
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

  const currentRawImage = images[currentIndex] || images[0] || '';
  const { displayUrl, isLoading: isHeicConverting } = useRenderableImage(currentRawImage);

  if (!isOpen || images.length === 0) return null;

  const backdropOpacity = dragDownOffset > 0 
    ? Math.max(0.4, 0.95 - (dragDownOffset / 400)) 
    : 0.95;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-between select-none touch-none animate-fadeIn transition-colors duration-150"
      style={{ backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})` }}
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
          {scale > 1.05 && (
            <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900/80 px-2 py-0.5 rounded border border-white/10">
              {Math.round(scale * 100)}%
            </span>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 font-mono">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 1.05}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {scale > 1.05 && (
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
            title="Close"
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
        {isHeicConverting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30">
            <Loader2 className="w-8 h-8 text-[#00C0FF] animate-spin" />
          </div>
        )}

        {/* Scalable & Swipeable Image */}
        <div 
          className={`relative max-w-full max-h-full flex items-center justify-center ${
            isTransitioning ? 'transition-transform duration-200 ease-out' : ''
          }`}
          style={{
            transform: scale > 1 
              ? `translate(${position.x}px, ${position.y}px) scale(${scale})` 
              : `translate(${swipeOffset}px, ${dragDownOffset}px)`,
            cursor: scale > 1 ? (isDraggingMouse.current ? 'grabbing' : 'grab') : 'default',
            touchAction: 'none'
          }}
        >
          <img
            src={displayUrl || currentRawImage}
            alt={title || `Vehicle Photo ${currentIndex + 1}`}
            className="max-w-[94vw] max-h-[74vh] object-contain rounded-lg shadow-2xl pointer-events-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Thumbnails Carousel for Quick Selection */}
      {images.length > 1 && (
        <div className="p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 overflow-x-auto custom-scrollbar flex items-center justify-center gap-2 sm:gap-3">
          {images.map((img, i) => (
            <ThumbnailItem
              key={`${img}-${i}`}
              imgUrl={img}
              index={i}
              isSelected={currentIndex === i}
              onSelect={() => {
                setCurrentIndex(i);
                resetZoom();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ThumbnailItem({
  imgUrl,
  index,
  isSelected,
  onSelect
}: {
  key?: React.Key;
  imgUrl: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { displayUrl } = useRenderableImage(imgUrl);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex-shrink-0 w-14 sm:w-20 h-10 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
        isSelected
          ? 'border-[#00C0FF] scale-105 opacity-100 shadow-md shadow-[#00C0FF]/30'
          : 'border-white/10 opacity-50 hover:opacity-80'
      }`}
    >
      <img src={displayUrl || imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
    </button>
  );
}
