'use client';

import { MediaLibrary } from '@/components/MediaLibrary';
import { ContentCalendar } from '@/components/ContentCalendar';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { AICaptionStudio } from '@/components/AICaptionStudio';
import { AutomationBuilder } from '@/components/AutomationBuilder';
import { AccountManager } from '@/components/AccountManager';
import { TeamManager } from '@/components/TeamManager';

function SectionPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="rounded-xl border p-8 max-w-lg"
      style={{ background: 'var(--bg1)', borderColor: 'var(--border)' }}
    >
      <h2 className="font-display font-semibold text-lg mb-2">{title}</h2>
      <p className="text-sm" style={{ color: 'var(--text2)' }}>
        {description}
      </p>
    </div>
  );
}

interface DashboardSectionContentProps {
  section: string;
}

export function DashboardSectionContent({ section }: DashboardSectionContentProps) {
  switch (section) {
    case 'dashboard':
      return <AnalyticsDashboard />;
    case 'media':
      return <MediaLibrary />;
    case 'calendar':
      return <ContentCalendar />;
    case 'analytics':
      return <AnalyticsDashboard />;
    case 'ai-studio':
      return <AICaptionStudio />;
    case 'automations':
      return <AutomationBuilder />;
    case 'integrations':
      return (
        <div className="max-w-2xl w-full">
          <AccountManager />
          <p className="text-xs mt-4" style={{ color: 'var(--text3)' }}>
            <a href="/dashboard/integrations" className="underline hover:text-[var(--accent)]">
              Open full integrations page
            </a>{' '}
            for all platforms and connection details.
          </p>
        </div>
      );
    case 'trends':
      return (
        <SectionPlaceholder
          title="Trend Discovery"
          description="Discover trending topics and hashtags for your niche. Connect platforms in Integrations to unlock personalized trends."
        />
      );
    case 'team':
      return <TeamManager />;
    case 'crm':
      return (
        <SectionPlaceholder
          title="Creator CRM"
          description="Manage sponsor relationships, deliverables, and creator partnerships in one place."
        />
      );
    case 'settings':
      return (
        <SectionPlaceholder
          title="Settings"
          description="Account preferences, notification settings, and workspace configuration."
        />
      );
    default:
      return (
        <SectionPlaceholder
          title="Section not found"
          description={`Unknown section: ${section}`}
        />
      );
  }
}

export function isComposerSection(section: string) {
  return section === 'composer';
}
