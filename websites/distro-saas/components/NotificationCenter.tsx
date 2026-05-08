'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
} from 'lucide-react';
import { useNotificationStore } from '@/lib/store';
import type { Notification, Platform } from '@/types';

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: '#ff0000',
  tiktok: '#ff0050',
  linkedin: '#0077b5',
  facebook: '#1877f2',
  instagram: '#e4405f',
  twitter: '#1da1f2',
};

const TYPE_CONFIG: Record<Notification['type'], { icon: React.ReactNode; color: string }> = {
  success: { icon: <CheckCircle size={14} />, color: 'var(--success)' },
  error: { icon: <AlertTriangle size={14} />, color: 'var(--danger)' },
  warning: { icon: <Clock size={14} />, color: 'var(--warning)' },
  info: { icon: <Info size={14} />, color: 'var(--info)' },
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } =
    useNotificationStore();

  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const readNotifications = notifications.filter((n) => n.is_read);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-all hover:bg-white/5"
        style={{ color: 'var(--text2)' }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full"
            style={{ background: 'var(--danger)', color: 'white' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-96 rounded-xl overflow-hidden border shadow-2xl z-50"
              style={{ background: 'var(--bg1)', borderColor: 'var(--border2)' }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-2">
                  <Bell size={16} style={{ color: 'var(--accent)' }} />
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--danger)', color: 'white' }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-1.5 rounded hover:bg-white/5 transition-colors"
                      style={{ color: 'var(--text3)' }}
                      title="Mark all as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded hover:bg-white/5 transition-colors"
                    style={{ color: 'var(--text3)' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div
                className="max-h-[60vh] overflow-y-auto"
                style={{ scrollbarWidth: 'thin' }}
              >
                {notifications.length === 0 ? (
                  <div
                    className="text-center py-8"
                    style={{ color: 'var(--text3)' }}
                  >
                    <Bell size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <>
                    {/* Unread */}
                    {unreadNotifications.length > 0 && (
                      <div className="py-1">
                        <div
                          className="px-4 py-1 text-[10px] font-mono uppercase tracking-wider"
                          style={{ color: 'var(--text3)' }}
                        >
                          New
                        </div>
                        {unreadNotifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            onRemove={removeNotification}
                          />
                        ))}
                      </div>
                    )}

                    {/* Read */}
                    {readNotifications.length > 0 && (
                      <div className="py-1 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div
                          className="px-4 py-1 text-[10px] font-mono uppercase tracking-wider"
                          style={{ color: 'var(--text3)' }}
                        >
                          Earlier
                        </div>
                        {readNotifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            onRemove={removeNotification}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div
                className="px-4 py-2 border-t text-center text-xs"
                style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}
              >
                <button className="hover:text-[var(--text2)] transition-colors">
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onRemove,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const config = TYPE_CONFIG[notification.type];

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3 transition-all hover:bg-white/5 ${
        !notification.is_read ? 'bg-white/[0.02]' : ''
      }`}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${config.color}20`, color: config.color }}
      >
        {notification.platform && PLATFORM_COLORS[notification.platform] ? (
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: PLATFORM_COLORS[notification.platform] }}
          />
        ) : (
          config.icon
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight">{notification.title}</p>
          <span
            className="text-[10px] font-mono flex-shrink-0"
            style={{ color: 'var(--text3)' }}
          >
            {formatTimeAgo(notification.created_at)}
          </span>
        </div>
        <p
          className="text-xs mt-0.5 line-clamp-2"
          style={{ color: 'var(--text2)' }}
        >
          {notification.message}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1.5">
          {notification.action_url && (
            <a
              href={notification.action_url}
              className="text-[10px] flex items-center gap-1 hover:underline"
              style={{ color: config.color }}
            >
              View <ExternalLink size={10} />
            </a>
          )}
          {!notification.is_read && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-[10px] flex items-center gap-1 hover:underline"
              style={{ color: 'var(--text3)' }}
            >
              <Check size={10} /> Mark read
            </button>
          )}
          {notification.type === 'error' && (
            <button
              className="text-[10px] flex items-center gap-1 hover:underline"
              style={{ color: 'var(--warning)' }}
            >
              <RefreshCw size={10} /> Retry
            </button>
          )}
        </div>
      </div>

      {/* Remove button (visible on hover) */}
      <button
        onClick={() => onRemove(notification.id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/5 transition-all"
        style={{ color: 'var(--text3)' }}
      >
        <X size={12} />
      </button>
    </div>
  );
}
