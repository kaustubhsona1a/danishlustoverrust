import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { UploadCloud, X, Plus, Loader2, CheckCircle2, RotateCcw, ZoomIn } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useVehicles } from '../../context/VehicleContext';
import { Vehicle } from '../../data/mockData';
import { uploadImageToStorage } from '../../lib/supabase';
import PhotoLightbox from '../../components/PhotoLightbox';
import { useRenderableImage } from '../../lib/imageUtils';

const DRAFT_STORAGE_KEY = 'dealer_add_vehicle_draft_v2';

interface UploadProgressState {
  isUploading: boolean;
  current: number;
  total: number;
  message: string;
}

export default function AdminAddVehicle() {
  const { vehicles, addVehicle, updateVehicle } = useVehicles();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isEditing = Boolean(id);

  const [previewLightboxIndex, setPreviewLightboxIndex] = useState<number | null>(null);

  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({
    isUploading: false,
    current: 0,
    total: 0,
    message: ''
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  // Initial form values
  const defaultFormData = {
    make: '',
    model: '',
    variant: '',
    year: new Date().getFullYear(),
    price: '',
    registration: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    mileage: '',
    ownership: '1st Owner',
    engine: '',
    color: '',
    description: '',
    instagramReel: '',
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [images, setImages] = useState<string[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  // Load existing vehicle if editing, or restore draft if creating a new vehicle
  useEffect(() => {
    if (isEditing && id) {
      const vehicle = vehicles.find(v => v.id === id);
      if (vehicle) {
        setFormData({
          make: vehicle.make,
          model: vehicle.model,
          variant: vehicle.variant || '',
          year: vehicle.year,
          price: vehicle.price.toString(),
          registration: vehicle.registration || '',
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
          mileage: vehicle.mileage.toString(),
          ownership: vehicle.ownership,
          engine: vehicle.engine || '',
          color: vehicle.color || '',
          description: vehicle.description || '',
          instagramReel: vehicle.instagramReel || '',
        });
        setImages(vehicle.images || []);
      }
    } else if (!isEditing) {
      // Restore draft for new car creation (prevents losing state on Android app-switching/folding)
      try {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed === 'object') {
            if (parsed.formData) setFormData(parsed.formData);
            if (Array.isArray(parsed.images) && parsed.images.length > 0) {
              setImages(parsed.images);
              setHasRestoredDraft(true);
            }
          }
        }
      } catch (err) {
        console.warn('Could not restore vehicle draft:', err);
      }
    }
  }, [id, isEditing, vehicles]);

  // Auto-save draft on change when creating a new vehicle
  useEffect(() => {
    if (!isEditing) {
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            formData,
            images,
            lastSaved: Date.now()
          })
        );
      } catch (err) {
        console.warn('Could not auto-save draft to localStorage:', err);
      }
    }
  }, [formData, images, isEditing]);

  const clearDraft = () => {
    if (window.confirm('Reset this form and clear uploaded photos draft?')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setFormData(defaultFormData);
      setImages([]);
      setHasRestoredDraft(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    const newImages = [...images];
    const [removed] = newImages.splice(draggedIdx, 1);
    newImages.splice(targetIdx, 0, removed);
    setImages(newImages);
    setDraggedIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  // Robust, sequential image upload that handles high-resolution Android/Samsung Fold photos gracefully
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files: File[] = Array.from(fileList);
    // Reset file input value immediately so user can select more or re-select if needed
    e.target.value = '';

    const remainingSlots = 20 - images.length;
    if (remainingSlots <= 0) {
      alert('Maximum 20 images allowed per vehicle.');
      return;
    }

    const filesToUpload: File[] = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      alert(`Only the first ${remainingSlots} images will be uploaded (20 image limit).`);
    }

    setUploadProgress({
      isUploading: true,
      current: 0,
      total: filesToUpload.length,
      message: `Preparing ${filesToUpload.length} photos...`
    });

    const newlyUploaded: string[] = [];

    // Process sequentially to prevent mobile out-of-memory / canvas crashes
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      setUploadProgress({
        isUploading: true,
        current: i + 1,
        total: filesToUpload.length,
        message: `Compressing & Uploading ${i + 1} of ${filesToUpload.length}: ${file.name}`
      });

      try {
        const uploadedUrl = await uploadImageToStorage(file, 'vehicles', 'vehicle-images');
        if (uploadedUrl) {
          newlyUploaded.push(uploadedUrl);
          // Update images state progressively so user sees photos appear in real-time
          setImages(prev => [...prev, uploadedUrl]);
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
      }
    }

    setUploadProgress({
      isUploading: false,
      current: filesToUpload.length,
      total: filesToUpload.length,
      message: 'Upload complete!'
    });
  };

  const handleAddImageUrl = (e: FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setImages(prev => {
        if (prev.length >= 20) {
          alert('Maximum 20 images allowed per vehicle.');
          return prev;
        }
        return [...prev, imageUrlInput.trim()];
      });
      setImageUrlInput('');
    }
  };

  const removeImage = async (index: number) => {
    const urlToRemove = images[index];
    setImages(prev => prev.filter((_, i) => i !== index));

    // Cleanup from Supabase if needed
    try {
      if (urlToRemove && typeof urlToRemove === 'string' && urlToRemove.includes('supabase.co')) {
        const isEditingOriginal = isEditing && id && vehicles.find(v => v.id === id)?.images?.includes(urlToRemove);
        if (!isEditingOriginal) {
          const { deleteImagesFromStorage } = await import('../../lib/supabase');
          await deleteImagesFromStorage([urlToRemove], 'vehicle-images');
        }
      }
    } catch (err) {
      console.warn("Failed to cleanup image:", err);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (isEditing && id) {
      updateVehicle(id, {
        make: formData.make,
        model: formData.model,
        variant: formData.variant,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        fuelType: formData.fuelType as 'Petrol' | 'Diesel' | 'CNG' | 'Electric',
        transmission: formData.transmission as 'Manual' | 'Automatic',
        engine: formData.engine || 'Standard',
        color: formData.color || 'Standard',
        ownership: formData.ownership,
        registration: formData.registration,
        description: formData.description,
        instagramReel: formData.instagramReel,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'],
      });
    } else {
      const newVehicle: Vehicle = {
        id: 'v' + Date.now().toString(),
        make: formData.make,
        model: formData.model,
        variant: formData.variant,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        fuelType: formData.fuelType as 'Petrol' | 'Diesel' | 'CNG' | 'Electric',
        transmission: formData.transmission as 'Manual' | 'Automatic',
        engine: formData.engine || 'Standard',
        color: formData.color || 'Standard',
        ownership: formData.ownership,
        registration: formData.registration,
        description: formData.description,
        instagramReel: formData.instagramReel,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'],
        features: ['Air Conditioning', 'Power Steering'], 
        status: 'Available',
      };
      addVehicle(newVehicle);
      // Clear saved draft on successful submission
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
    
    navigate('/dealer-management/inventory');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-widest uppercase">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
          <p className="text-zinc-400 text-xs mt-2 font-mono uppercase tracking-wider font-semibold">{isEditing ? 'Update the details for this listing in the gallery.' : 'Fill in the specifications to list a new car in inventory.'}</p>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          {!isEditing && (images.length > 0 || formData.make) && (
            <button
              type="button"
              onClick={clearDraft}
              className="text-center px-3 py-3.5 bg-zinc-900/60 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-950/40 rounded-xl text-xs font-bold tracking-wider font-mono uppercase transition-all flex items-center gap-1.5"
              title="Clear current draft"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Draft</span>
            </button>
          )}
          <Link to="/dealer-management/inventory" className="flex-grow sm:flex-grow-0 text-center px-4 sm:px-5 py-3.5 bg-zinc-900/40 border border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-xl text-xs font-bold tracking-widest font-mono uppercase transition-all">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={uploadProgress.isUploading}
            className="flex-grow sm:flex-grow-0 text-center px-4 sm:px-6 py-3.5 bg-[#00C0FF] hover:bg-white text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold tracking-widest font-mono uppercase transition-all shadow-lg shadow-[#00C0FF]/10"
          >
            {isEditing ? 'Save Changes' : 'Save Vehicle'}
          </button>
        </div>
      </div>

      {/* Restored Draft Notification */}
      {!isEditing && hasRestoredDraft && (
        <div className="bg-[#00C0FF]/10 border border-[#00C0FF]/30 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono text-zinc-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00C0FF] shrink-0" />
            <span>Restored your saved photos & form details. Your data is automatically protected when switching apps.</span>
          </div>
          <button type="button" onClick={() => setHasRestoredDraft(false)} className="text-[#00C0FF] hover:underline uppercase text-[10px] font-bold ml-2">
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-zinc-950/65 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl space-y-8 text-zinc-300">
        
        {/* Basic Info */}
        <div>
          <h2 className="text-sm font-bold font-serif text-[#00C0FF] mb-6 border-b border-white/5 pb-2 uppercase tracking-widest">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Make *</label>
              <input required name="make" value={formData.make} onChange={handleChange} placeholder="e.g. Honda" className="w-full flex h-12 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00C0FF] transition-all font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Model *</label>
              <input required name="model" value={formData.model} onChange={handleChange} placeholder="e.g. City" className="w-full flex h-12 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00C0FF] transition-all font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Variant</label>
              <input name="variant" value={formData.variant} onChange={handleChange} placeholder="e.g. ZX CVT" className="w-full flex h-12 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00C0FF] transition-all font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Manufacturing Year *</label>
              <input required type="number" name="year" value={formData.year} onChange={handleChange} placeholder="2020" className="w-full flex h-12 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00C0FF] transition-all font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Price (₹) *</label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="1125000" className="w-full flex h-12 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-2 text-xs text-[#00C0FF] placeholder-zinc-750 outline-none focus:border-[#00C0FF] transition-all font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Registration Number</label>
              <input name="registration" value={formData.registration} onChange={handleChange} placeholder="MH-04-XX-XXXX" className="w-full flex h-12 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00C0FF] transition-all font-mono" />
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div>
          <h2 className="text-sm font-bold font-serif text-[#00C0FF] mb-6 border-b border-white/5 pb-2 uppercase tracking-widest">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Fuel Type</label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="flex h-12 w-full items-center justify-between rounded-xl border border-white/5 bg-zinc-950 px-4 py-2 text-xs text-zinc-300 outline-none focus:border-[#00C0FF] transition-all font-mono uppercase tracking-wider">
                <option className="bg-zinc-950 text-white">Petrol</option>
                <option className="bg-zinc-950 text-white">Diesel</option>
                <option className="bg-zinc-950 text-white">CNG</option>
                <option className="bg-zinc-950 text-white">Electric</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="flex h-12 w-full items-center justify-between rounded-xl border border-white/5 bg-zinc-950 px-4 py-2 text-xs text-zinc-300 outline-none focus:border-[#00C0FF] transition-all font-mono uppercase tracking-wider">
                <option className="bg-zinc-950 text-white">Manual</option>
                <option className="bg-zinc-950 text-white">Automatic</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Mileage (km) *</label>
              <input required type="number" name="mileage" value={formData.mileage} onChange={handleChange} placeholder="45000" className="w-full flex h-12 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00C0FF] transition-all font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Ownership</label>
              <select name="ownership" value={formData.ownership} onChange={handleChange} className="flex h-12 w-full items-center justify-between rounded-xl border border-white/5 bg-zinc-950 px-4 py-2 text-xs text-zinc-300 outline-none focus:border-[#00C0FF] transition-all font-mono uppercase tracking-wider">
                <option className="bg-zinc-950 text-white">1st Owner</option>
                <option className="bg-zinc-950 text-white">2nd Owner</option>
                <option className="bg-zinc-950 text-white">3rd+ Owner</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Engine CC</label>
              <input name="engine" value={formData.engine} onChange={handleChange} placeholder="e.g. 1498 cc" className="w-full flex h-12 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00C0FF] transition-all font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Color</label>
              <input name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Radiant Red" className="w-full flex h-12 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#00C0FF] transition-all font-mono" />
            </div>
          </div>
        </div>

        {/* Media / Vehicle Gallery */}
        <div>
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
            <h2 className="text-sm font-bold font-serif text-[#00C0FF] uppercase tracking-widest">
              Vehicle Gallery ({images.length}/20)
            </h2>
            {images.length > 0 && (
              <span className="text-[10px] font-mono text-zinc-400">
                {images.length} photo{images.length > 1 ? 's' : ''} saved
              </span>
            )}
          </div>

          {/* Uploading Progress Notification */}
          {uploadProgress.isUploading && (
            <div className="mb-4 bg-zinc-900/90 border border-[#00C0FF]/40 rounded-xl p-4 flex flex-col gap-2 animate-pulse">
              <div className="flex items-center justify-between text-xs font-mono text-white">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#00C0FF] animate-spin" />
                  {uploadProgress.message}
                </span>
                <span className="font-bold text-[#00C0FF]">
                  {Math.round((uploadProgress.current / Math.max(uploadProgress.total, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#00C0FF] h-2 transition-all duration-300 rounded-full"
                  style={{ width: `${(uploadProgress.current / Math.max(uploadProgress.total, 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          <PhotoLightbox
            images={images}
            initialIndex={previewLightboxIndex ?? 0}
            isOpen={previewLightboxIndex !== null}
            onClose={() => setPreviewLightboxIndex(null)}
            title={`${formData.year || ''} ${formData.make || ''} ${formData.model || ''}`}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {images.map((img, i) => (
              <AdminPhotoCard
                key={`${img}-${i}`}
                imgUrl={img}
                index={i}
                isDragged={draggedIdx === i}
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
                onClick={() => setPreviewLightboxIndex(i)}
                onRemove={() => removeImage(i)}
              />
            ))}

            {images.length < 20 && (
              <label 
                htmlFor="vehicle-photo-input"
                className={`border-2 border-dashed ${uploadProgress.isUploading ? 'border-zinc-700 opacity-50 cursor-not-allowed' : 'border-white/15 hover:border-[#00C0FF]/50 cursor-pointer hover:bg-[#00C0FF]/5'} rounded-xl aspect-video flex flex-col items-center justify-center p-4 text-center bg-zinc-900/30 text-zinc-400 hover:text-[#00C0FF] transition-all font-mono text-xs`}
              >
                {uploadProgress.isUploading ? (
                  <Loader2 className="w-7 h-7 mb-2 text-[#00C0FF] animate-spin" />
                ) : (
                  <UploadCloud className="w-7 h-7 mb-2" />
                )}
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  {uploadProgress.isUploading ? 'Processing...' : '+ Add Photos'}
                </span>
                <span className="text-[8px] text-zinc-500 mt-1">Gallery / Files</span>
                <input 
                  id="vehicle-photo-input"
                  type="file" 
                  multiple 
                  accept="image/*,image/jpeg,image/png,image/webp,image/heic,image/heif" 
                  disabled={uploadProgress.isUploading} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>
            )}
          </div>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-2">
            Select photos from your phone Gallery or Files app. Photos are automatically compressed and saved as you upload. First photo is the showroom thumbnail.
          </p>

          <div className="mt-4 p-4 rounded-xl border border-white/5 bg-zinc-900/10 space-y-2">
            <label className="text-[9px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">Or Add Image via Direct Web URL</label>
            <div className="flex gap-2">
              <input 
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://example.com/vehicle-photo.jpg"
                className="flex-grow text-xs px-4 py-2.5 border border-white/5 bg-zinc-950 rounded-xl text-white outline-none placeholder-zinc-700 focus:border-[#00C0FF] transition-all font-mono"
              />
              <button 
                type="button"
                onClick={handleAddImageUrl}
                className="bg-[#00C0FF]/25 hover:bg-[#00C0FF] text-[#00C0FF] hover:text-zinc-950 border border-[#00C0FF]/30 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest font-mono transition-all flex items-center shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add URL
              </button>
            </div>
          </div>
        </div>

        {/* Instagram Reel Link */}
        <div>
          <h2 className="text-sm font-bold font-serif text-[#E1306C] mb-6 border-b border-white/5 pb-2 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C]" /> Instagram Reel Link
          </h2>
          <p className="text-zinc-400 text-xs uppercase font-mono tracking-wider mb-4 leading-relaxed">Add a highlighted Instagram Reel showcasing this vehicle. This will be prominently shown to customers so they can view interactive social proof directly on Instagram.</p>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Instagram Reel URL</label>
            <input 
              name="instagramReel" 
              type="url" 
              value={formData.instagramReel} 
              onChange={handleChange} 
              placeholder="e.g. https://www.instagram.com/reel/C8O7w-pS9f3/" 
              className="w-full flex h-12 items-center rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-2 text-xs text-white placeholder-zinc-700 outline-none focus:border-[#E1306C] transition-all font-mono" 
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold font-serif text-[#00C0FF] mb-6 border-b border-white/5 pb-2 uppercase tracking-widest">Description & Notes</h2>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter any specific luxury features, vehicle condition detail, or custom service information..." className="flex w-full rounded-xl border border-white/5 bg-zinc-900/30 px-4 py-3 text-xs text-zinc-200 placeholder-zinc-700 min-h-[120px] outline-none focus:border-[#00C0FF] transition-all font-mono" />
        </div>

      </div>
    </form>
  );
}

function AdminPhotoCard({
  imgUrl,
  index,
  isDragged,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onClick,
  onRemove
}: {
  key?: React.Key;
  imgUrl: string;
  index: number;
  isDragged: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onClick: () => void;
  onRemove: () => void;
}) {
  const { displayUrl } = useRenderableImage(imgUrl);

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`relative aspect-video rounded-xl overflow-hidden border ${isDragged ? 'border-[#00C0FF] opacity-50' : 'border-white/10'} group cursor-pointer hover:border-[#00C0FF]/60 transition-all bg-zinc-900`}
      title="Click to view full photo & zoom"
    >
      <img src={displayUrl || imgUrl} alt={`Preview ${index}`} className="w-full h-full object-cover pointer-events-none" />
      <div className="absolute top-2 left-2 bg-zinc-950/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded font-mono border border-white/10 shadow-sm pointer-events-none">
        {index === 0 ? 'THUMBNAIL' : `#${index + 1}`}
      </div>
      <button 
        type="button" 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="Remove photo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

