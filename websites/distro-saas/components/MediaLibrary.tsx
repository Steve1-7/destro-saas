'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Video,
  Search,
  Filter,
  Grid,
  List,
  Folder,
  Plus,
  MoreHorizontal,
  Trash2,
  Copy,
  ExternalLink,
  Clock,
  FileText,
  Check,
  X,
  Upload,
  Tag,
  Loader2,
} from 'lucide-react';
import { useMediaStore, useUIStore } from '@/lib/store';
import type { MediaItem, MediaFolder, Platform } from '@/types';

interface MediaLibraryProps {
  className?: string;
  onSelect?: (item: MediaItem) => void;
  selectable?: boolean;
}

export function MediaLibrary({ className, onSelect, selectable = false }: MediaLibraryProps) {
  const { folders, items, selectedFolderId, viewMode, selectedItems, setViewMode, selectFolder, toggleItemSelection, setFolders, setItems } = useMediaStore();
  const { addToast } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch media data from API
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch('/api/media');
        if (!response.ok) throw new Error('Failed to fetch media');
        const data = await response.json();
        setFolders(data.folders || []);
        setItems(data.media || []);
      } catch (error) {
        addToast({ type: 'error', message: 'Failed to load media library' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [setFolders, setItems, addToast]);

  const filteredMedia = items.filter((item) => {
    const matchesFolder = selectedFolderId ? item.folder_id === selectedFolderId : true;
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const colors = ['#ff0050', '#ff0000', '#0077b5', '#1877f2', '#e4405f', '#1da1f2'];
    const newFolder: MediaFolder = {
      id: crypto.randomUUID(),
      user_id: 'user_123',
      name: newFolderName,
      color: colors[Math.floor(Math.random() * colors.length)],
      item_count: 0,
      created_at: new Date().toISOString(),
    };
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setIsCreatingFolder(false);
    addToast({ type: 'success', message: 'Folder created!' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text)' }}>
            Media Library
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-1 rounded-full" style={{ background: 'var(--bg2)', color: 'var(--text3)' }}>
              {filteredMedia.length} items
            </span>
            {selectedItems.length > 0 && (
              <span className="text-[11px] px-2 py-1 rounded-full" style={{ background: 'var(--accent)', color: '#040d0a' }}>
                {selectedItems.length} selected
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg border transition-all hover:border-[var(--border2)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
          >
            {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'var(--accent)', color: '#040d0a' }}
          >
            <Upload size={16} />
            Upload
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Folders Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-2">
          <button
            onClick={() => selectFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
              selectedFolderId === null ? 'bg-white/5' : ''
            }`}
          >
            <Folder size={16} style={{ color: selectedFolderId === null ? 'var(--accent)' : 'var(--text3)' }} />
            <span className="text-sm" style={{ color: selectedFolderId === null ? 'var(--text)' : 'var(--text2)' }}>
              All Media
            </span>
            <span className="ml-auto text-[10px]" style={{ color: 'var(--text3)' }}>
              {isLoading ? '-' : items.length}
            </span>
          </button>

          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => selectFolder(folder.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                selectedFolderId === folder.id ? 'bg-white/5' : ''
              }`}
            >
              <Folder size={16} style={{ color: folder.color }} />
              <span className="text-sm truncate" style={{ color: selectedFolderId === folder.id ? 'var(--text)' : 'var(--text2)' }}>
                {folder.name}
              </span>
              <span className="ml-auto text-[10px]" style={{ color: 'var(--text3)' }}>
                {folder.item_count}
              </span>
            </button>
          ))}

          {/* Add Folder */}
          {isCreatingFolder ? (
            <div className="flex items-center gap-2 px-3 py-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name..."
                className="flex-1 px-2 py-1 rounded text-xs border bg-transparent outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <button onClick={handleCreateFolder} className="p-1 rounded hover:bg-white/5">
                <Check size={14} style={{ color: 'var(--accent)' }} />
              </button>
              <button
                onClick={() => { setIsCreatingFolder(false); setNewFolderName(''); }}
                className="p-1 rounded hover:bg-white/5"
              >
                <X size={14} style={{ color: 'var(--text3)' }} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all hover:bg-white/5"
            >
              <Plus size={16} style={{ color: 'var(--text3)' }} />
              <span className="text-sm" style={{ color: 'var(--text3)' }}>New Folder</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
              <Search size={16} style={{ color: 'var(--text3)' }} />
              <input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--text)' }}
              />
            </div>
            <button className="p-2 rounded-lg border transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
              <Filter size={18} />
            </button>
          </div>

          {/* Media Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-3 gap-3">
              {filteredMedia.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  onClick={() => {
                    if (selectable) {
                      toggleItemSelection(item.id);
                      onSelect?.(item);
                    }
                  }}
                  className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                    selectedItems.includes(item.id) ? 'ring-2 ring-[var(--accent)]' : ''
                  }`}
                  style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square relative">
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--bg3)' }}>
                      {item.type === 'video' ? (
                        <Video size={32} style={{ color: 'var(--text3)' }} />
                      ) : (
                        <Image size={32} style={{ color: 'var(--text3)' }} />
                      )}
                    </div>
                    {item.type === 'video' && item.duration && (
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}>
                        {formatDuration(item.duration)}
                      </span>
                    )}
                    {selectedItems.includes(item.id) && (
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                        <Check size={12} color="#040d0a" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{item.filename}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px]" style={{ color: 'var(--text3)' }}>{formatFileSize(item.size)}</span>
                      {item.used_in_posts.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>
                          {item.used_in_posts.length} posts
                        </span>
                      )}
                    </div>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (selectable) {
                      toggleItemSelection(item.id);
                      onSelect?.(item);
                    }
                  }}
                  className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                    selectedItems.includes(item.id) ? 'ring-1 ring-[var(--accent)]' : ''
                  }`}
                  style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg3)' }}>
                    {item.type === 'video' ? <Video size={20} style={{ color: 'var(--text3)' }} /> : <Image size={20} style={{ color: 'var(--text3)' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{item.filename}</p>
                    <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text3)' }}>
                      <span>{formatFileSize(item.size)}</span>
                      {item.duration && <span>• {formatDuration(item.duration)}</span>}
                      {item.width && item.height && <span>• {item.width}x{item.height}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                  {item.used_in_posts.length > 0 && (
                    <span className="text-[10px] px-2 py-1 rounded" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>
                      {item.used_in_posts.length} posts
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
