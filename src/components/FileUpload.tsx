import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onFilesChange: (files: { data: string; mimeType: string; name: string }[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<{ name: string; type: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    const processedFiles: Promise<{ data: string; mimeType: string; name: string }>[] = newFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            data: reader.result as string,
            mimeType: file.type,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(processedFiles).then(results => {
      onFilesChange(results);
      setFiles(prev => [...prev, ...newFiles.map(f => ({ name: f.name, type: f.type }))]);
    });
  }, [onFilesChange]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer
          ${isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className={`w-10 h-10 mb-3 ${isDragging ? 'text-indigo-500' : 'text-zinc-400'}`} />
        <p className="text-sm font-medium text-zinc-600">Drag & drop compliance documents</p>
        <p className="text-xs text-zinc-400 mt-1">PDF, JPG, PNG (Max 5 files)</p>
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          accept=".pdf,image/*"
          onChange={(e) => handleFile(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                {file.type.includes('image') ? <ImageIcon className="w-4 h-4 text-zinc-400" /> : <FileText className="w-4 h-4 text-zinc-400" />}
                <span className="text-xs font-medium text-zinc-700 truncate max-w-[200px]">{file.name}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const newFiles = files.filter((_, idx) => idx !== i);
                  setFiles(newFiles);
                }}
                className="p-1 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
