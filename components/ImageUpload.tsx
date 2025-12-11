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
      // Remove data URL prefix for API
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
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-indigo-50 transition-colors duration-300 group"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="mb-2 text-lg font-semibold text-slate-700">
            Upload your room photo
          </p>
          <p className="text-sm text-slate-500">
            Click to browse or drag and drop
          </p>
          <p className="text-xs text-slate-400 mt-2">
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
