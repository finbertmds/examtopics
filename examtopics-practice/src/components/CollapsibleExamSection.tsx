import { ReactNode, useId, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { HOME_SECTION_PREFERENCES_PREFIX, homeSectionOwner } from '../utils/homeSectionPreferences';

interface Props {
  sectionId: 'progress' | 'completed' | 'available';
  title: string;
  userId?: string;
  sessionId?: string | null;
  children: ReactNode;
}

const Section = ({ title, storageKey, children }: Omit<Props, 'sectionId' | 'userId' | 'sessionId'> & { storageKey: string }) => {
  const { t } = useLanguage();
  const contentId = useId();
  const headingId = useId();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch {
      // Keep the control usable when browser storage is blocked or full.
    }
  };

  return (
    <section aria-labelledby={headingId} className="mb-8">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 id={headingId} className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-controls={contentId}
          aria-label={`${t(collapsed ? 'expand' : 'collapse')} ${title}`}
          className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
        >
          {t(collapsed ? 'expand' : 'collapse')}
          <span aria-hidden="true">{collapsed ? '▼' : '▲'}</span>
        </button>
      </div>
      <div id={contentId} hidden={collapsed}>{children}</div>
    </section>
  );
};

const CollapsibleExamSection = ({ userId, sessionId, sectionId, ...props }: Props) => {
  const owner = homeSectionOwner(userId);
  const scope = userId ? encodeURIComponent(sessionId || 'pending') : 'guest';
  const storageKey = `${HOME_SECTION_PREFERENCES_PREFIX}${owner}:${scope}:${sectionId}`;
  return <Section key={storageKey} storageKey={storageKey} {...props} />;
};

export default CollapsibleExamSection;
