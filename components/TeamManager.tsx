'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  MoreHorizontal,
  Mail,
  Crown,
  Shield,
  Eye,
  Check,
  X,
  Clock,
  MessageSquare,
  Trash2,
  UserPlus,
  Settings,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useTeamStore, useUIStore } from '@/lib/store';
import type { TeamMember, TeamRole } from '@/types';

const ROLE_CONFIG: Record<TeamRole, { icon: React.ReactNode; label: string; description: string; color: string }> = {
  admin: { icon: <Crown size={14} />, label: 'Admin', description: 'Full access', color: 'var(--warning)' },
  editor: { icon: <Shield size={14} />, label: 'Editor', description: 'Create & edit', color: 'var(--accent)' },
  viewer: { icon: <Eye size={14} />, label: 'Viewer', description: 'View only', color: 'var(--text3)' },
};

interface TeamManagerProps {
  className?: string;
}

export function TeamManager({ className }: TeamManagerProps) {
  const { members, invites, setMembers, setInvites, addMember, updateMember, removeMember, addInvite, removeInvite, isInviting, setIsInviting } = useTeamStore();
  const { addToast } = useUIStore();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('editor');
  const [activeTab, setActiveTab] = useState<'members' | 'invites'>('members');
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch team data from API
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch('/api/team');
        if (!response.ok) throw new Error('Failed to fetch team');
        const data = await response.json();
        setMembers(data.members || []);
        setInvites(data.invites || []);
      } catch (error) {
        addToast({ type: 'error', message: 'Failed to load team data' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [setMembers, setInvites, addToast]);

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      addToast({ type: 'error', message: 'Please enter a valid email' });
      return;
    }

    addInvite({ email: inviteEmail, role: inviteRole });
    setInviteEmail('');
    setIsInviting(false);
    addToast({ type: 'success', message: `Invitation sent to ${inviteEmail}` });
  };

  const handleRoleChange = (memberId: string, newRole: TeamRole) => {
    updateMember(memberId, { role: newRole });
    setEditingMember(null);
    addToast({ type: 'success', message: 'Role updated' });
  };

  const handleRemoveMember = (memberId: string) => {
    removeMember(memberId);
    addToast({ type: 'info', message: 'Member removed from team' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text)' }}>
            Team Members
          </h3>
          <div className="flex p-1 rounded-lg" style={{ background: 'var(--bg2)' }}>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'members' ? 'bg-[var(--bg3)] text-[var(--text)]' : 'text-[var(--text3)]'
              }`}
            >
              Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('invites')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'invites' ? 'bg-[var(--bg3)] text-[var(--text)]' : 'text-[var(--text3)]'
              }`}
            >
              Invites ({invites.length})
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsInviting(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: 'var(--accent)', color: '#040d0a' }}
        >
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl border overflow-hidden"
            style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="font-semibold text-sm">Invite Team Member</span>
              <button onClick={() => setIsInviting(false)} className="p-1 rounded hover:bg-white/5">
                <X size={16} style={{ color: 'var(--text3)' }} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider mb-2 block" style={{ color: 'var(--text3)' }}>
                  Email Address
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
                  <Mail size={16} style={{ color: 'var(--text3)' }} />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{ color: 'var(--text)' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider mb-2 block" style={{ color: 'var(--text3)' }}>
                  Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['admin', 'editor', 'viewer'] as TeamRole[]).map((role) => {
                    const config = ROLE_CONFIG[role];
                    return (
                      <button
                        key={role}
                        onClick={() => setInviteRole(role)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          inviteRole === role ? 'border-[var(--accent)]' : ''
                        }`}
                        style={{
                          background: inviteRole === role ? 'rgba(110,231,183,0.08)' : 'var(--bg2)',
                          borderColor: inviteRole === role ? 'var(--accent)' : 'var(--border)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ color: config.color }}>{config.icon}</span>
                          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                          {config.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsInviting(false)}
                  className="px-4 py-2 rounded-lg text-sm border transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'var(--accent)', color: '#040d0a' }}
                >
                  Send Invite
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members List */}
      {activeTab === 'members' && (
        <div className="space-y-2">
          {members.map((member) => {
            const roleConfig = ROLE_CONFIG[member.role];
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-xl border"
                style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{ background: member.avatar ? 'transparent' : 'linear-gradient(135deg, var(--accent2), var(--accent3))' }}
                  >
                    {member.avatar ? (
                      <img src={member.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span style={{ color: 'var(--text)' }}>{member.name[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{member.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text3)' }}>{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {member.last_active_at && (
                    <span className="text-[10px]" style={{ color: 'var(--text3)' }}>
                      <Clock size={10} className="inline mr-1" />
                      Active {formatDate(member.last_active_at)}
                    </span>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setEditingMember(editingMember === member.id ? null : member.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-all"
                      style={{
                        background: 'var(--bg2)',
                        borderColor: 'var(--border)',
                        color: roleConfig.color,
                      }}
                    >
                      {roleConfig.icon}
                      {roleConfig.label}
                      <ChevronDown size={12} />
                    </button>
                    {editingMember === member.id && (
                      <div className="absolute top-full right-0 mt-1 w-32 rounded-lg border overflow-hidden shadow-xl z-10" style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
                        {(['admin', 'editor', 'viewer'] as TeamRole[]).map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(member.id, role)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors"
                            style={{ color: ROLE_CONFIG[role].color }}
                          >
                            {ROLE_CONFIG[role].icon}
                            {ROLE_CONFIG[role].label}
                            {member.role === role && <Check size={12} className="ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    style={{ color: 'var(--danger)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invites List */}
      {activeTab === 'invites' && (
        <div className="space-y-2">
          {invites.length === 0 ? (
            <div className="text-center py-8 rounded-xl border" style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}>
              <Mail size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text3)' }} />
              <p className="text-sm" style={{ color: 'var(--text3)' }}>No pending invites</p>
            </div>
          ) : (
            invites.map((invite) => (
              <div
                key={invite.email}
                className="flex items-center justify-between p-3 rounded-xl border"
                style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--bg2)' }}>
                    <Mail size={16} style={{ color: 'var(--text3)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{invite.email}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
                      {ROLE_CONFIG[invite.role as TeamRole].label} • Sent {formatDate(invite.sentAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { removeInvite(invite.email); addToast({ type: 'info', message: 'Invite cancelled' }); }}
                  className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                  style={{ color: 'var(--danger)' }}
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
