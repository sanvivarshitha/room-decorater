import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string, preview: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [onImageSelected]);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onImageSelected(base64, result);
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