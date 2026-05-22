// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Platform,
  Post,
  MediaItem,
  MediaFolder,
  CalendarEvent,
  ConnectedAccount,
  Notification,
  AutomationWorkflow,
  CaptionTone,
  TrendingItem,
  TeamMember,
  Sponsor,
} from '@/types';

// Navigation State
interface NavState {
  activeSection: string;
  sidebarCollapsed: boolean;
  setActiveSection: (section: string) => void;
  toggleSidebar: () => void;
}

// Command Palette State
interface CommandPaletteState {
  isOpen: boolean;
  searchQuery: string;
  selectedIndex: number;
  open: () => void;
  close: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
}

// Notification State
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

// Account/Integration State
interface AccountState {
  accounts: ConnectedAccount[];
  selectedAccountId: string | null;
  isConnecting: boolean;
  setAccounts: (accounts: ConnectedAccount[]) => void;
  addAccount: (account: ConnectedAccount) => void;
  updateAccount: (id: string, updates: Partial<ConnectedAccount>) => void;
  removeAccount: (id: string) => void;
  selectAccount: (id: string | null) => void;
  setIsConnecting: (value: boolean) => void;
}

// Media Library State
interface MediaState {
  items: MediaItem[];
  folders: MediaFolder[];
  selectedFolderId: string | null;
  selectedItems: string[];
  isUploading: boolean;
  uploadProgress: number;
  viewMode: 'grid' | 'list';
  setItems: (items: MediaItem[]) => void;
  addItem: (item: MediaItem) => void;
  removeItem: (id: string) => void;
  setFolders: (folders: MediaFolder[]) => void;
  selectFolder: (id: string | null) => void;
  toggleItemSelection: (id: string) => void;
  setUploading: (value: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

// Caption Studio State
interface CaptionState {
  masterCaption: string;
  tone: CaptionTone;
  variants: Partial<Record<Platform, string>>;
  selectedPlatforms: Set<Platform>;
  analysis: {
    engagement_score: number;
    readability_score: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    word_count: number;
    suggested_hashtags: string[];
    optimization_tips: string[];
  } | null;
  isGenerating: boolean;
  options: {
    makeViral: boolean;
    makeProfessional: boolean;
    makeShorter: boolean;
    addCTA: boolean;
    generateHashtags: boolean;
  };
  setMasterCaption: (caption: string) => void;
  setTone: (tone: CaptionTone) => void;
  setVariants: (variants: Partial<Record<Platform, string>>) => void;
  togglePlatform: (platform: Platform) => void;
  setAnalysis: (analysis: CaptionState['analysis']) => void;
  setIsGenerating: (value: boolean) => void;
  setOption: (key: keyof CaptionState['options'], value: boolean) => void;
  reset: () => void;
}

// Calendar State
interface CalendarState {
  events: CalendarEvent[];
  selectedDate: Date;
  viewMode: 'month' | 'week' | 'day';
  selectedEventId: string | null;
  isDragging: boolean;
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: 'month' | 'week' | 'day') => void;
  selectEvent: (id: string | null) => void;
  setIsDragging: (value: boolean) => void;
}

// Analytics State
interface AnalyticsState {
  period: '7d' | '30d' | '90d' | '1y';
  selectedPlatforms: Set<Platform>;
  comparisonMode: boolean;
  setPeriod: (period: '7d' | '30d' | '90d' | '1y') => void;
  togglePlatform: (platform: Platform) => void;
  setComparisonMode: (value: boolean) => void;
}

// Automation State
interface AutomationState {
  workflows: AutomationWorkflow[];
  selectedWorkflowId: string | null;
  isCreating: boolean;
  setWorkflows: (workflows: AutomationWorkflow[]) => void;
  addWorkflow: (workflow: AutomationWorkflow) => void;
  updateWorkflow: (id: string, updates: Partial<AutomationWorkflow>) => void;
  removeWorkflow: (id: string) => void;
  selectWorkflow: (id: string | null) => void;
  toggleWorkflow: (id: string) => void;
  setIsCreating: (value: boolean) => void;
}

// Trending State
interface TrendingState {
  items: TrendingItem[];
  selectedCategory: string | null;
  selectedPlatform: Platform | null;
  isLoading: boolean;
  setItems: (items: TrendingItem[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedPlatform: (platform: Platform | null) => void;
  setIsLoading: (value: boolean) => void;
}

// Team State
interface TeamState {
  members: TeamMember[];
  invites: { email: string; role: string; sentAt: string }[];
  isInviting: boolean;
  setMembers: (members: TeamMember[]) => void;
  setInvites: (invites: { email: string; role: string; sentAt: string }[]) => void;
  addMember: (member: TeamMember) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  removeMember: (id: string) => void;
  addInvite: (invite: { email: string; role: string }) => void;
  removeInvite: (email: string) => void;
  setIsInviting: (value: boolean) => void;
}

// CRM/Sponsor State
interface CRMState {
  sponsors: Sponsor[];
  selectedSponsorId: string | null;
  isCreating: boolean;
  setSponsors: (sponsors: Sponsor[]) => void;
  addSponsor: (sponsor: Sponsor) => void;
  updateSponsor: (id: string, updates: Partial<Sponsor>) => void;
  removeSponsor: (id: string) => void;
  selectSponsor: (id: string | null) => void;
  setIsCreating: (value: boolean) => void;
}

// UI State
interface UIState {
  theme: 'dark' | 'light';
  reduceMotion: boolean;
  showOnboarding: boolean;
  modals: {
    repurpose: boolean;
    schedule: boolean;
    share: boolean;
    settings: boolean;
  };
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  setTheme: (theme: 'dark' | 'light') => void;
  setReduceMotion: (value: boolean) => void;
  setShowOnboarding: (value: boolean) => void;
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  addToast: (toast: Omit<UIState['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
}

// Combined Store
export const useNavStore = create<NavState>((set) => ({
  activeSection: 'composer',
  sidebarCollapsed: false,
  setActiveSection: (section) => set({ activeSection: section }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  isOpen: false,
  searchQuery: '',
  selectedIndex: 0,
  open: () => set({ isOpen: true, searchQuery: '', selectedIndex: 0 }),
  close: () => set({ isOpen: false }),
  setSearchQuery: (query) => set({ searchQuery: query, selectedIndex: 0 }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),
}));

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id && !n.is_read)
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    })),
}));

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  selectedAccountId: null,
  isConnecting: false,
  setAccounts: (accounts) => set({ accounts }),
  addAccount: (account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),
  updateAccount: (id, updates) =>
    set((state) => ({
      accounts: state.accounts.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  removeAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((a) => a.id !== id),
      selectedAccountId:
        state.selectedAccountId === id ? null : state.selectedAccountId,
    })),
  selectAccount: (id) => set({ selectedAccountId: id }),
  setIsConnecting: (value) => set({ isConnecting: value }),
}));

export const useMediaStore = create<MediaState>((set) => ({
  items: [],
  folders: [],
  selectedFolderId: null,
  selectedItems: [],
  isUploading: false,
  uploadProgress: 0,
  viewMode: 'grid',
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  setFolders: (folders) => set({ folders }),
  selectFolder: (id) => set({ selectedFolderId: id, selectedItems: [] }),
  toggleItemSelection: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.includes(id)
        ? state.selectedItems.filter((i) => i !== id)
        : [...state.selectedItems, id],
    })),
  setUploading: (value) => set({ isUploading: value }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));

export const useCaptionStore = create<CaptionState>((set) => ({
  masterCaption: '',
  tone: 'casual',
  variants: {},
  selectedPlatforms: new Set<Platform>(),
  analysis: null,
  isGenerating: false,
  options: {
    makeViral: false,
    makeProfessional: false,
    makeShorter: false,
    addCTA: false,
    generateHashtags: true,
  },
  setMasterCaption: (caption) => set({ masterCaption: caption }),
  setTone: (tone) => set({ tone }),
  setVariants: (variants) => set({ variants }),
  togglePlatform: (platform) =>
    set((state) => {
      const newSet = new Set(state.selectedPlatforms);
      if (newSet.has(platform)) {
        newSet.delete(platform);
      } else {
        newSet.add(platform);
      }
      return { selectedPlatforms: newSet };
    }),
  setAnalysis: (analysis) => set({ analysis }),
  setIsGenerating: (value) => set({ isGenerating: value }),
  setOption: (key, value) =>
    set((state) => ({
      options: { ...state.options, [key]: value },
    })),
  reset: () =>
    set({
      masterCaption: '',
      variants: {},
      selectedPlatforms: new Set<Platform>(),
      analysis: null,
    }),
}));

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  selectedDate: new Date(),
  viewMode: 'month',
  selectedEventId: null,
  isDragging: false,
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  removeEvent: (id) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setViewMode: (mode) => set({ viewMode: mode }),
  selectEvent: (id) => set({ selectedEventId: id }),
  setIsDragging: (value) => set({ isDragging: value }),
}));

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  period: '30d',
  selectedPlatforms: new Set<Platform>(['youtube', 'tiktok', 'linkedin', 'facebook']),
  comparisonMode: false,
  setPeriod: (period) => set({ period }),
  togglePlatform: (platform) =>
    set((state) => {
      const newSet = new Set(state.selectedPlatforms);
      if (newSet.has(platform)) {
        newSet.delete(platform);
      } else {
        newSet.add(platform);
      }
      return { selectedPlatforms: newSet };
    }),
  setComparisonMode: (value) => set({ comparisonMode: value }),
}));

export const useAutomationStore = create<AutomationState>((set) => ({
  workflows: [],
  selectedWorkflowId: null,
  isCreating: false,
  setWorkflows: (workflows) => set({ workflows }),
  addWorkflow: (workflow) =>
    set((state) => ({ workflows: [...state.workflows, workflow] })),
  updateWorkflow: (id, updates) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),
  removeWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
      selectedWorkflowId:
        state.selectedWorkflowId === id ? null : state.selectedWorkflowId,
    })),
  selectWorkflow: (id) => set({ selectedWorkflowId: id }),
  toggleWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, is_active: !w.is_active } : w
      ),
    })),
  setIsCreating: (value) => set({ isCreating: value }),
}));

export const useTrendingStore = create<TrendingState>((set) => ({
  items: [],
  selectedCategory: null,
  selectedPlatform: null,
  isLoading: false,
  setItems: (items) => set({ items }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  setIsLoading: (value) => set({ isLoading: value }),
}));

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  invites: [],
  isInviting: false,
  setMembers: (members) => set({ members }),
  setInvites: (invites) => set({ invites }),
  addMember: (member) =>
    set((state) => ({ members: [...state.members, member] })),
  updateMember: (id, updates) =>
    set((state) => ({
      members: state.members.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
  removeMember: (id) =>
    set((state) => ({ members: state.members.filter((m) => m.id !== id) })),
  addInvite: (invite) =>
    set((state) => ({
      invites: [
        ...state.invites,
        { ...invite, sentAt: new Date().toISOString() },
      ],
    })),
  removeInvite: (email) =>
    set((state) => ({
      invites: state.invites.filter((i) => i.email !== email),
    })),
  setIsInviting: (value) => set({ isInviting: value }),
}));

export const useCRMStore = create<CRMState>((set) => ({
  sponsors: [],
  selectedSponsorId: null,
  isCreating: false,
  setSponsors: (sponsors) => set({ sponsors }),
  addSponsor: (sponsor) =>
    set((state) => ({ sponsors: [...state.sponsors, sponsor] })),
  updateSponsor: (id, updates) =>
    set((state) => ({
      sponsors: state.sponsors.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  removeSponsor: (id) =>
    set((state) => ({
      sponsors: state.sponsors.filter((s) => s.id !== id),
      selectedSponsorId:
        state.selectedSponsorId === id ? null : state.selectedSponsorId,
    })),
  selectSponsor: (id) => set({ selectedSponsorId: id }),
  setIsCreating: (value) => set({ isCreating: value }),
}));

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  reduceMotion: false,
  showOnboarding: false,
  modals: {
    repurpose: false,
    schedule: false,
    share: false,
    settings: false,
  },
  toasts: [],
  setTheme: (theme) => set({ theme }),
  setReduceMotion: (value) => set({ reduceMotion: value }),
  setShowOnboarding: (value) => set({ showOnboarding: value }),
  openModal: (modal) =>
    set((state) => ({ modals: { ...state.modals, [modal]: true } })),
  closeModal: (modal) =>
    set((state) => ({ modals: { ...state.modals, [modal]: false } })),
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: crypto.randomUUID() },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
