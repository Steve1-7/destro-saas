'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isToday,
} from 'date-fns';
import { useCalendarStore, useUIStore } from '@/lib/store';
import type { Platform, CalendarEvent, PostStatus } from '@/types';

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: '#ff0000',
  tiktok: '#ff0050',
  linkedin: '#0077b5',
  facebook: '#1877f2',
  instagram: '#e4405f',
  twitter: '#1da1f2',
};

const STATUS_CONFIG: Record<PostStatus, { icon: React.ReactNode; color: string; label: string }> = {
  draft: { icon: <AlertCircle size={12} />, color: 'var(--text3)', label: 'Draft' },
  queued: { icon: <Clock size={12} />, color: 'var(--warning)', label: 'Queued' },
  scheduled: { icon: <Clock size={12} />, color: 'var(--accent2)', label: 'Scheduled' },
  publishing: { icon: <Clock size={12} />, color: 'var(--accent)', label: 'Publishing' },
  published: { icon: <CheckCircle2 size={12} />, color: 'var(--success)', label: 'Published' },
  failed: { icon: <AlertCircle size={12} />, color: 'var(--danger)', label: 'Failed' },
};

interface ContentCalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}

export function ContentCalendar({ events = [], onEventClick, onDateClick }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const { selectedDate, setSelectedDate } = useCalendarStore();
  const { addToast } = useUIStore();

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.scheduled_at), day));
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: 'var(--text2)' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-sm font-medium rounded-lg border transition-colors hover:border-[var(--border2)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: 'var(--text2)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <h2 className="font-display font-semibold text-lg" style={{ color: 'var(--text)' }}>
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--bg2)' }}>
            {(['month', 'week'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="px-3 py-1 text-xs font-medium rounded-md capitalize transition-all"
                style={{
                  background: viewMode === mode ? 'var(--bg3)' : 'transparent',
                  color: viewMode === mode ? 'var(--text)' : 'var(--text3)',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              addToast({ type: 'info', message: 'Schedule post feature coming soon' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'var(--accent)', color: '#040d0a' }}
          >
            <Plus size={14} />
            Schedule
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-mono uppercase tracking-wider py-2"
              style={{ color: 'var(--text3)' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            const isSelected = isSameDay(day, selectedDate);

            return (
              <motion.button
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.005 }}
                onClick={() => {
                  setSelectedDate(day);
                  onDateClick?.(day);
                }}
                className="relative min-h-[100px] p-2 rounded-lg border text-left transition-all hover:border-[var(--border2)]"
                style={{
                  background: isSelected
                    ? 'rgba(110,231,183,0.08)'
                    : isTodayDate
                    ? 'rgba(59,130,246,0.08)'
                    : 'var(--bg2)',
                  borderColor: isSelected
                    ? 'var(--accent)'
                    : isTodayDate
                    ? 'var(--accent2)'
                    : 'var(--border)',
                  opacity: isCurrentMonth ? 1 : 0.4,
                }}
              >
                {/* Day number */}
                <span
                  className="text-sm font-medium"
                  style={{
                    color: isTodayDate
                      ? 'var(--accent2)'
                      : isCurrentMonth
                      ? 'var(--text)'
                      : 'var(--text3)',
                  }}
                >
                  {format(day, 'd')}
                </span>

                {/* Events */}
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      className="px-1.5 py-0.5 rounded text-[10px] truncate cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        background: `${PLATFORM_COLORS[event.platform]}20`,
                        color: PLATFORM_COLORS[event.platform],
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div
                      className="px-1.5 text-[10px]"
                      style={{ color: 'var(--text3)' }}
                    >
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Events */}
      {selectedDate && (
        <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm" style={{ color: 'var(--text)' }}>
              {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            <span className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>
              {getEventsForDay(selectedDate).length} events
            </span>
          </div>

          {getEventsForDay(selectedDate).length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text3)' }}>
              No posts scheduled for this day
            </p>
          ) : (
            <div className="space-y-2">
              {getEventsForDay(selectedDate).map((event) => {
                const status = STATUS_CONFIG[event.status];
                return (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all hover:border-[var(--border2)]"
                    style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
                  >
                    {/* Platform indicator */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `${PLATFORM_COLORS[event.platform]}20`,
                        color: PLATFORM_COLORS[event.platform],
                      }}
                    >
                      {event.platform.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                        {event.title}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
                        {format(new Date(event.scheduled_at), 'h:mm a')}
                      </p>
                    </div>

                    {/* Status */}
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium"
                      style={{ background: `${status.color}20`, color: status.color }}
                    >
                      {status.icon}
                      {status.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
