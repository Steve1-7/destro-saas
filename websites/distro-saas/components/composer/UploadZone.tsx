'use client';

// components/composer/UploadZone.tsx
import { useRef, useState, useCallback } from 'react';
import { Upload, X, FileVideo, Image as ImageIcon } from 'lucide-react';
import { useUpload } from '@/hooks/useUpload';

interface UploadZoneProps {
  onUpload?: (url: string, file: File) => void;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { uploading, progress, upload } = useUpload();

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    const url = await upload(f);
    if (url) onUpload?.(url, f);
  }, [upload, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const isVideo = file?.type.startsWith('video/');

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="video/*,image/*"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {file ? (
        <div className="relative rounded-lg overflow-hidden">
          <div
            className="w-full h-36 flex flex-col items-center justify-center gap-2 rounded-lg"
            style={{ background: 'var(--bg3)' }}>
            {isVideo
              ? <FileVideo size={36} style={{ color: 'var(--text3)' }} />
              : <ImageIcon size={36} style={{ color: 'var(--text3)' }} />}
            <span className="text-[11px] font-mono" style={{ color: 'var(--text2)' }}>
              {file.name}
            </span>
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="absolute bottom-0 left-0 right-0">
              <div className="h-1" style={{ background: 'var(--bg3)' }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: 'var(--accent)' }}
                />
              </div>
              <div className="absolute top-0 right-1 -translate-y-full text-[10px] font-mono pb-0.5"
                style={{ color: 'var(--accent)' }}>
                {progress}%
              </div>
            </div>
          )}

          {/* Type badge */}
          <div
            className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded border"
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'var(--accent)',
              borderColor: 'rgba(110,231,183,0.3)',
            }}>
            {isVideo ? 'VIDEO' : 'IMAGE'} · {file.name.split('.').pop()?.toUpperCase()}
          </div>

          {/* Remove button */}
          <button
            onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--text2)' }}>
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
          style={{
            borderColor: dragging ? 'var(--accent)' : 'var(--border2)',
            background: dragging ? 'rgba(110,231,183,0.04)' : 'rgba(255,255,255,0.02)',
          }}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}>
          <Upload size={28} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium mb-1">Drop media here</p>
          <p className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>
            or click to browse · MP4, MOV, JPG, PNG
          </p>
        </div>
      )}
    </div>
  );
}
