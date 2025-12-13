
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
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
          <img src={preview} alt="Room Preview" className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             <button 
               onClick={handleClear}
               className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition-colors border border-white/50"
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
             className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Change Photo
          </button>
          <button 
             onClick={handleConfirm}
             className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
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
        className="flex flex-col items-center justify-center w-full h-80 border-2 border-indigo-200 border-dashed rounded-3xl cursor-pointer bg-white/50 hover:bg-white/80 transition-all duration-300 group hover:border-violet-400 hover:shadow-xl backdrop-blur-sm"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="bg-white p-5 rounded-2xl shadow-md mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Upload className="w-10 h-10 text-violet-600" />
          </div>
          <p className="mb-3 text-xl font-heading font-bold text-slate-800">
            Upload your room photo
          </p>
          <p className="text-sm text-slate-500 font-medium">
            Click to browse or drag and drop
          </p>
          <p className="text-xs text-slate-400 mt-4 bg-slate-100 px-3 py-1 rounded-full">
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
