'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  PenTool,
  Image,
  Calendar,
  BarChart3,
  Sparkles,
  Zap,
  Link2,
  Users,
  Settings,
  TrendingUp,
  Briefcase,
  Command,
  ChevronRight,
  ChevronLeft,
  Bell,
} from 'lucide-react';
import { useNavStore } from '@/lib/store';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  shortcut?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, shortcut: 'G D' },
  { id: 'composer', label: 'Create Post', icon: <PenTool size={18} />, shortcut: 'G C' },
  { id: 'media', label: 'Media Library', icon: <Image size={18} />, shortcut: 'G M' },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} />, shortcut: 'G L', badge: 3 },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} />, shortcut: 'G A' },
  { id: 'ai-studio', label: 'AI Studio', icon: <Sparkles size={18} />, shortcut: 'G I' },
  { id: 'automations', label: 'Automations', icon: <Zap size={18} />, shortcut: 'G U' },
  { id: 'integrations', label: 'Integrations', icon: <Link2 size={18} />, shortcut: 'G N' },
  { id: 'trends', label: 'Trend Discovery', icon: <TrendingUp size={18} />, shortcut: 'G R' },
  { id: 'team', label: 'Team', icon: <Users size={18} />, shortcut: 'G T' },
  { id: 'crm', label: 'Creator CRM', icon: <Briefcase size={18} />, shortcut: 'G S' },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} />, shortcut: '⌘ ,' },
];

interface SidebarNavProps {
  className?: string;
}

export function SidebarNav({ className }: SidebarNavProps) {
  const { activeSection, sidebarCollapsed, setActiveSection, toggleSidebar } = useNavStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside
      className={`flex flex-col border-r transition-all duration-300 ${className}`}
      style={{
        width: sidebarCollapsed ? '72px' : '240px',
        borderColor: 'var(--border)',
        background: 'var(--bg)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#040d0a"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-display font-bold text-sm">Distro</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          style={{ color: 'var(--text3)' }}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-2 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group"
              style={{
                background: isActive ? 'var(--bg2)' : isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text2)',
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-5 rounded-r-full"
                  style={{ background: 'var(--accent)' }}
                />
              )}

              {/* Icon */}
              <span
                className="flex-shrink-0"
                style={{
                  color: isActive ? 'var(--accent)' : isHovered ? 'var(--text)' : 'var(--text3)',
                }}
              >
                {item.icon}
              </span>

              {/* Label */}
              {!sidebarCollapsed && (
                <span
                  className="text-sm font-medium flex-1 text-left"
                  style={{
                    color: isActive ? 'var(--text)' : isHovered ? 'var(--text)' : 'var(--text2)',
                  }}
                >
                  {item.label}
                </span>
              )}

              {/* Badge */}
              {!sidebarCollapsed && item.badge && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--danger)', color: 'white' }}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && isHovered && (
                <div
                  className="absolute left-full ml-2 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap z-50 tooltip-arrow"
                  style={{ background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)' }}
                >
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        {/* Command Palette Hint */}
        {!sidebarCollapsed && (
          <div
            className="flex items-center justify-between px-3 py-2 rounded-lg text-[11px]"
            style={{ background: 'var(--bg2)', color: 'var(--text3)' }}
          >
            <div className="flex items-center gap-1.5">
              <Command size={12} />
              <span>Command Palette</span>
            </div>
            <span className="font-mono">⌘K</span>
          </div>
        )}

        {/* User Profile */}
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors mt-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#040d0a' }}
          >
            U
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                User Name
              </p>
              <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
                Pro Plan
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
