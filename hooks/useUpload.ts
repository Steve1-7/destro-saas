// hooks/useUpload.ts
'use client';

import { useState } from 'react';

interface UploadState {
  uploading: boolean;
  progress: number;
  url: string | null;
  error: string | null;
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    url: null,
    error: null,
  });

  async function upload(file: File): Promise<string | null> {
    setState({ uploading: true, progress: 0, url: null, error: null });

    try {
      // Get presigned URL
      const res = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      if (!res.ok) throw new Error('Failed to get upload URL');
      const { signedUrl, publicUrl } = await res.json();

      // Upload directly to Supabase Storage
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setState((prev) => ({
            ...prev,
            progress: Math.round((e.loaded / e.total) * 100),
          }));
        }
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => (xhr.status === 200 ? resolve() : reject());
        xhr.onerror = reject;
        xhr.send(file);
      });

      setState({ uploading: false, progress: 100, url: publicUrl, error: null });
      return publicUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setState({ uploading: false, progress: 0, url: null, error: msg });
      return null;
    }
  }

  function reset() {
    setState({ uploading: false, progress: 0, url: null, error: null });
  }

  return { ...state, upload, reset };
}
