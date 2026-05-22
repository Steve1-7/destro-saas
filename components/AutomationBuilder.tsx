'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Plus,
  Trash2,
  Play,
  Pause,
  MoreHorizontal,
  ArrowRight,
  Bell,
  Share2,
  FileText,
  Clock,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useAutomationStore, useUIStore } from '@/lib/store';
import type { AutomationWorkflow, Platform, AutomationTrigger, AutomationAction } from '@/types';

const TRIGGER_OPTIONS: { id: AutomationTrigger; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'upload_complete', label: 'Upload Complete', icon: <FileText size={16} />, description: 'When a new video or image is uploaded' },
  { id: 'publish_success', label: 'Publish Success', icon: <Check size={16} />, description: 'When a post is successfully published' },
  { id: 'schedule_due', label: 'Schedule Due', icon: <Clock size={16} />, description: 'When a scheduled post is ready' },
  { id: 'engagement_threshold', label: 'Engagement Threshold', icon: <Zap size={16} />, description: 'When post reaches certain likes/views' },
];

const ACTION_OPTIONS: { id: AutomationAction; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'crosspost', label: 'Cross-Post', icon: <Share2 size={16} />, description: 'Repost to another platform' },
  { id: 'generate_caption', label: 'Generate Caption', icon: <FileText size={16} />, description: 'Create AI-optimized caption' },
  { id: 'notify', label: 'Send Notification', icon: <Bell size={16} />, description: 'Alert team or yourself' },
  { id: 'schedule', label: 'Schedule Post', icon: <Clock size={16} />, description: 'Queue for optimal time' },
];

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: '#ff0000',
  tiktok: '#ff0050',
  linkedin: '#0077b5',
  facebook: '#1877f2',
  instagram: '#e4405f',
  twitter: '#1da1f2',
};

interface AutomationBuilderProps {
  className?: string;
}

export function AutomationBuilder({ className }: AutomationBuilderProps) {
  const { workflows, isCreating, setIsCreating, addWorkflow, updateWorkflow, removeWorkflow, toggleWorkflow } = useAutomationStore();
  const { addToast } = useUIStore();
  const [editingWorkflow, setEditingWorkflow] = useState<Partial<AutomationWorkflow> | null>(null);
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

  const handleCreateWorkflow = () => {
    setEditingWorkflow({
      name: 'New Workflow',
      is_active: true,
      trigger: { type: 'upload_complete' },
      actions: [{ type: 'crosspost' }],
    });
    setIsCreating(true);
  };

  const handleSaveWorkflow = () => {
    if (!editingWorkflow?.name) {
      addToast({ type: 'error', message: 'Workflow name is required' });
      return;
    }

    const newWorkflow: AutomationWorkflow = {
      id: crypto.randomUUID(),
      user_id: 'user_123',
      name: editingWorkflow.name,
      is_active: editingWorkflow.is_active ?? true,
      trigger: editingWorkflow.trigger || { type: 'upload_complete' },
      actions: editingWorkflow.actions || [],
      created_at: new Date().toISOString(),
      run_count: 0,
    };

    addWorkflow(newWorkflow);
    setIsCreating(false);
    setEditingWorkflow(null);
    addToast({ type: 'success', message: 'Workflow created successfully!' });
  };

  const addAction = () => {
    if (editingWorkflow) {
      setEditingWorkflow({
        ...editingWorkflow,
        actions: [...(editingWorkflow.actions || []), { type: 'notify' }],
      });
    }
  };

  const removeAction = (index: number) => {
    if (editingWorkflow) {
      const newActions = [...(editingWorkflow.actions || [])];
      newActions.splice(index, 1);
      setEditingWorkflow({ ...editingWorkflow, actions: newActions });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text)' }}>
            Automation Workflows
          </h3>
          <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
            {workflows.length} workflow{workflows.length !== 1 ? 's' : ''} • {workflows.filter(w => w.is_active).length} active
          </p>
        </div>
        <button
          onClick={handleCreateWorkflow}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: 'var(--accent)', color: '#040d0a' }}
        >
          <Plus size={16} />
          Create Workflow
        </button>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isCreating && editingWorkflow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl border overflow-hidden"
            style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <Zap size={18} style={{ color: 'var(--accent)' }} />
                <span className="font-semibold text-sm">Create Workflow</span>
              </div>
              <button
                onClick={() => { setIsCreating(false); setEditingWorkflow(null); }}
                className="p-1 rounded hover:bg-white/5"
                style={{ color: 'var(--text3)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Workflow Name */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider mb-2 block" style={{ color: 'var(--text3)' }}>
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={editingWorkflow.name || ''}
                  onChange={(e) => setEditingWorkflow({ ...editingWorkflow, name: e.target.value })}
                  placeholder="e.g., Auto-Crosspost to YouTube"
                  className="w-full px-3 py-2 rounded-lg border bg-transparent text-sm outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                />
              </div>

              {/* Trigger Selection */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider mb-2 block" style={{ color: 'var(--text3)' }}>
                  When This Happens (Trigger)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TRIGGER_OPTIONS.map((trigger) => (
                    <button
                      key={trigger.id}
                      onClick={() => setEditingWorkflow({ ...editingWorkflow, trigger: { type: trigger.id } })}
                      className="flex items-start gap-3 p-3 rounded-lg border text-left transition-all"
                      style={{
                        background: editingWorkflow.trigger?.type === trigger.id ? 'rgba(110,231,183,0.08)' : 'var(--bg2)',
                        borderColor: editingWorkflow.trigger?.type === trigger.id ? 'var(--accent)' : 'var(--border)',
                      }}
                    >
                      <span style={{ color: editingWorkflow.trigger?.type === trigger.id ? 'var(--accent)' : 'var(--text3)' }}>
                        {trigger.icon}
                      </span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                          {trigger.label}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                          {trigger.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text3)' }}>
                    Then Do These Actions
                  </label>
                  <button
                    onClick={addAction}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded border transition-all hover:border-[var(--accent)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                  >
                    <Plus size={12} />
                    Add Action
                  </button>
                </div>
                <div className="space-y-2">
                  {editingWorkflow.actions?.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
                      <div className="flex-1">
                        <select
                          value={action.type}
                          onChange={(e) => {
                            const newActions = [...(editingWorkflow.actions || [])];
                            newActions[index] = { ...action, type: e.target.value as AutomationAction };
                            setEditingWorkflow({ ...editingWorkflow, actions: newActions });
                          }}
                          className="w-full px-2 py-1.5 rounded border bg-transparent text-xs outline-none"
                          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                        >
                          {ACTION_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      {action.type === 'crosspost' && (
                        <select
                          value={action.platform || ''}
                          onChange={(e) => {
                            const newActions = [...(editingWorkflow.actions || [])];
                            newActions[index] = { ...action, platform: e.target.value as Platform };
                            setEditingWorkflow({ ...editingWorkflow, actions: newActions });
                          }}
                          className="px-2 py-1.5 rounded border bg-transparent text-xs outline-none"
                          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                        >
                          <option value="">Select Platform</option>
                          {(['youtube', 'tiktok', 'linkedin', 'facebook', 'instagram', 'twitter'] as Platform[]).map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={() => removeAction(index)}
                        className="p-1.5 rounded hover:bg-red-500/10 transition-colors"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => { setIsCreating(false); setEditingWorkflow(null); }}
                  className="px-4 py-2 rounded-lg text-sm border transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveWorkflow}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'var(--accent)', color: '#040d0a' }}
                >
                  Save Workflow
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflow List */}
      <div className="space-y-2">
        {workflows.length === 0 ? (
          <div className="text-center py-8 rounded-xl border" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
            <Zap size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text3)' }} />
            <p className="text-sm" style={{ color: 'var(--text3)' }}>No workflows yet</p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text3)' }}>Create your first automation to get started</p>
          </div>
        ) : (
          workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="rounded-xl border overflow-hidden transition-all"
              style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${workflow.is_active ? 'animate-pulse' : ''}`}
                    style={{ background: workflow.is_active ? 'rgba(110,231,183,0.1)' : 'var(--bg2)' }}
                  >
                    <Zap size={18} style={{ color: workflow.is_active ? 'var(--accent)' : 'var(--text3)' }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{workflow.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
                      {workflow.trigger.type.replace('_', ' ')} → {workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}
                      {workflow.run_count > 0 && ` • Run ${workflow.run_count} times`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWorkflow(workflow.id)}
                    className={`w-10 h-5 rounded-full relative transition-all ${workflow.is_active ? 'bg-green-500' : 'bg-gray-600'}`}
                  >
                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${workflow.is_active ? 'left-5' : 'left-0.5'}`} />
                  </button>
                  <button
                    onClick={() => setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)}
                    className="p-1.5 rounded hover:bg-white/5"
                    style={{ color: 'var(--text3)' }}
                  >
                    {expandedWorkflow === workflow.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <button
                    onClick={() => { removeWorkflow(workflow.id); addToast({ type: 'info', message: 'Workflow deleted' }); }}
                    className="p-1.5 rounded hover:bg-red-500/10"
                    style={{ color: 'var(--danger)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedWorkflow === workflow.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t overflow-hidden"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-1 rounded" style={{ background: 'var(--bg2)', color: 'var(--text3)' }}>
                          TRIGGER
                        </span>
                        <span className="text-sm" style={{ color: 'var(--text2)' }}>
                          {TRIGGER_OPTIONS.find(t => t.id === workflow.trigger.type)?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight size={14} style={{ color: 'var(--text3)' }} />
                      </div>
                      {workflow.actions.map((action, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[11px] font-mono px-2 py-1 rounded" style={{ background: 'var(--bg2)', color: 'var(--text3)' }}>
                            ACTION {i + 1}
                          </span>
                          <span className="text-sm" style={{ color: 'var(--text2)' }}>
                            {ACTION_OPTIONS.find(a => a.id === action.type)?.label}
                            {action.platform && ` → ${action.platform}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
