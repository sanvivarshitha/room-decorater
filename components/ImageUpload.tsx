
import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, ArrowRight, RotateCcw } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string, preview: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const b64 = result.split(',')[1];
      setPreview(result);
      setBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleConfirm = () => {
    if (base64 && preview) {
      onImageSelected(base64, preview);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setBase64(null);
  };

  if (preview) {
    return (
      <div className="w-full max-w-xl mx-auto animate-fade-in">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 group">
          <img src={preview} alt="Room Preview" className="w-full h-80 object-cover opacity-80" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             <button 
               onClick={handleClear}
               className="bg-black/40 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/60 transition-colors border border-white/20"
               title="Change Image"
             >
               <RotateCcw className="w-6 h-6" />
             </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <span className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
              Preview Mode
            </span>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-4">
          <button 
             onClick={handleClear}
             className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Change Photo
          </button>
          <button 
             onClick={handleConfirm}
             className="px-8 py-3 bg-white text-slate-950 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 hover:bg-violet-50"
          >
            Next Step <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-xl mx-auto"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <label 
        htmlFor="image-upload" 
        className="flex flex-col items-center justify-center w-full h-80 border-2 border-slate-700 border-dashed rounded-3xl cursor-pointer bg-slate-900/50 hover:bg-slate-800/70 transition-all duration-300 group hover:border-violet-500 hover:shadow-xl hover:shadow-violet-900/10 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="bg-slate-800 p-5 rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-white/5">
            <Upload className="w-10 h-10 text-violet-400" />
          </div>
          <p className="mb-3 text-xl font-heading font-bold text-white">
            Upload your room photo
          </p>
          <p className="text-sm text-slate-400 font-medium group-hover:text-violet-300 transition-colors">
            Click to browse or drag and drop
          </p>
          <p className="text-xs text-slate-500 mt-4 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Supports JPG, PNG (Max 10MB)
          </p>
        </div>
        <input 
          id="image-upload" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
