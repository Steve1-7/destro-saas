'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Command,
  FileText,
  Image,
  Calendar,
  BarChart3,
  Sparkles,
  Settings,
  Users,
  Bell,
  Zap,
  Hash,
  Briefcase,
  Upload,
  Send,
  X,
} from 'lucide-react';
import { useCommandPaletteStore, useNavStore, useUIStore } from '@/lib/store';

interface CommandItem {
  id: string;
  title: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  keywords: string[];
}

export function CommandPalette() {
  const { isOpen, searchQuery, selectedIndex, close, setSearchQuery, setSelectedIndex } =
    useCommandPaletteStore();
  const { setActiveSection } = useNavStore();
  const { addToast, openModal } = useUIStore();

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-composer',
        title: 'Go to Create Post',
        shortcut: 'G C',
        icon: <FileText size={16} />,
        action: () => {
          setActiveSection('composer');
          close();
        },
        category: 'Navigation',
        keywords: ['create', 'post', 'composer', 'write'],
      },
      {
        id: 'nav-media',
        title: 'Go to Media Library',
        shortcut: 'G M',
        icon: <Image size={16} />,
        action: () => {
          setActiveSection('media');
          close();
        },
        category: 'Navigation',
        keywords: ['media', 'library', 'uploads', 'files'],
      },
      {
        id: 'nav-calendar',
        title: 'Go to Calendar',
        shortcut: 'G L',
        icon: <Calendar size={16} />,
        action: () => {
          setActiveSection('calendar');
          close();
        },
        category: 'Navigation',
        keywords: ['calendar', 'schedule', 'plan'],
      },
      {
        id: 'nav-analytics',
        title: 'Go to Analytics',
        shortcut: 'G A',
        icon: <BarChart3 size={16} />,
        action: () => {
          setActiveSection('analytics');
          close();
        },
        category: 'Navigation',
        keywords: ['analytics', 'stats', 'metrics', 'performance'],
      },
      {
        id: 'nav-ai',
        title: 'Go to AI Studio',
        shortcut: 'G I',
        icon: <Sparkles size={16} />,
        action: () => {
          setActiveSection('ai-studio');
          close();
        },
        category: 'Navigation',
        keywords: ['ai', 'studio', 'generate', 'caption'],
      },
      {
        id: 'nav-automations',
        title: 'Go to Automations',
        shortcut: 'G U',
        icon: <Zap size={16} />,
        action: () => {
          setActiveSection('automations');
          close();
        },
        category: 'Navigation',
        keywords: ['automation', 'workflow', 'trigger'],
      },
      {
        id: 'nav-team',
        title: 'Go to Team',
        shortcut: 'G T',
        icon: <Users size={16} />,
        action: () => {
          setActiveSection('team');
          close();
        },
        category: 'Navigation',
        keywords: ['team', 'members', 'collaboration'],
      },
      {
        id: 'nav-trends',
        title: 'Go to Trends',
        shortcut: 'G R',
        icon: <Hash size={16} />,
        action: () => {
          setActiveSection('trends');
          close();
        },
        category: 'Navigation',
        keywords: ['trends', 'hashtags', 'viral', 'sounds'],
      },
      {
        id: 'nav-crm',
        title: 'Go to CRM',
        shortcut: 'G S',
        icon: <Briefcase size={16} />,
        action: () => {
          setActiveSection('crm');
          close();
        },
        category: 'Navigation',
        keywords: ['crm', 'sponsors', 'deals', 'campaigns'],
      },
      // Actions
      {
        id: 'action-new-post',
        title: 'Create New Post',
        shortcut: '⌘ N',
        icon: <Send size={16} />,
        action: () => {
          setActiveSection('composer');
          close();
          addToast({ type: 'info', message: 'Create your new post' });
        },
        category: 'Actions',
        keywords: ['new', 'create', 'post', 'compose'],
      },
      {
        id: 'action-upload',
        title: 'Upload Media',
        shortcut: '⌘ U',
        icon: <Upload size={16} />,
        action: () => {
          setActiveSection('composer');
          close();
          addToast({ type: 'info', message: 'Select media to upload' });
        },
        category: 'Actions',
        keywords: ['upload', 'media', 'video', 'image'],
      },
      {
        id: 'action-repurpose',
        title: 'Repurpose Content',
        shortcut: '⌘ R',
        icon: <Sparkles size={16} />,
        action: () => {
          openModal('repurpose');
          close();
        },
        category: 'Actions',
        keywords: ['repurpose', 'adapt', 'transform', 'ai'],
      },
      {
        id: 'action-settings',
        title: 'Open Settings',
        shortcut: '⌘ ,',
        icon: <Settings size={16} />,
        action: () => {
          openModal('settings');
          close();
        },
        category: 'Actions',
        keywords: ['settings', 'preferences', 'config'],
      },
      {
        id: 'action-notifications',
        title: 'View Notifications',
        shortcut: '⌘ ⇧ N',
        icon: <Bell size={16} />,
        action: () => {
          close();
          addToast({ type: 'info', message: 'Notifications panel opened' });
        },
        category: 'Actions',
        keywords: ['notifications', 'alerts', 'messages'],
      },
    ],
    [setActiveSection, close, addToast, openModal]
  );

  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return commands;
    const query = searchQuery.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query) ||
        cmd.keywords.some((k) => k.includes(query))
    );
  }, [commands, searchQuery]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const flatCommands = useMemo(
    () => Object.values(groupedCommands).flat(),
    [groupedCommands]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          useCommandPaletteStore.getState().open();
        }
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          close();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(
            selectedIndex < flatCommands.length - 1 ? selectedIndex + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(
            selectedIndex > 0 ? selectedIndex - 1 : flatCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (flatCommands[selectedIndex]) {
            flatCommands[selectedIndex].action();
          }
          break;
      }
    },
    [isOpen, close, selectedIndex, flatCommands, setSelectedIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={close}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl rounded-xl overflow-hidden border shadow-2xl"
          style={{ background: 'var(--bg1)', borderColor: 'var(--border2)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <Search size={20} style={{ color: 'var(--text3)' }} />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--text)' }}
              autoFocus
            />
            <div
              className="flex items-center gap-1 text-xs px-2 py-1 rounded border"
              style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}
            >
              <Command size={12} />
              <span>K</span>
            </div>
            <button
              onClick={close}
              className="p-1 rounded hover:bg-white/5 transition-colors"
              style={{ color: 'var(--text3)' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Command List */}
          <div
            className="max-h-[50vh] overflow-y-auto py-2"
            style={{ scrollbarWidth: 'thin' }}
          >
            {filteredCommands.length === 0 ? (
              <div
                className="text-center py-8 text-sm"
                style={{ color: 'var(--text3)' }}
              >
                No commands found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, items]) => {
                const startIndex = flatCommands.findIndex((c) => c.id === items[0].id);
                return (
                  <div key={category} className="mb-2">
                    <div
                      className="px-4 py-1.5 text-xs font-mono uppercase tracking-wider"
                      style={{ color: 'var(--text3)' }}
                    >
                      {category}
                    </div>
                    {items.map((cmd, idx) => {
                      const globalIndex = startIndex + idx;
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className="w-full flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg transition-all"
                          style={{
                            background: isSelected
                              ? 'var(--bg2)'
                              : 'transparent',
                            border: isSelected
                              ? '1px solid var(--border2)'
                              : '1px solid transparent',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              style={{
                                color: isSelected ? 'var(--accent)' : 'var(--text2)',
                              }}
                            >
                              {cmd.icon}
                            </span>
                            <span
                              className="text-sm"
                              style={{
                                color: isSelected ? 'var(--text)' : 'var(--text2)',
                              }}
                            >
                              {cmd.title}
                            </span>
                          </div>
                          {cmd.shortcut && (
                            <span
                              className="text-xs font-mono px-2 py-0.5 rounded"
                              style={{
                                background: isSelected
                                  ? 'var(--bg3)'
                                  : 'transparent',
                                color: 'var(--text3)',
                              }}
                            >
                              {cmd.shortcut}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-4 py-2 border-t text-xs"
            style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border text-[10px]" style={{ borderColor: 'var(--border)' }}>
                  ↑↓
                </kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border text-[10px]" style={{ borderColor: 'var(--border)' }}>
                  ↵
                </kbd>
                to select
              </span>
            </div>
            <span>{filteredCommands.length} commands</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
