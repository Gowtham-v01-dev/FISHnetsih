import { MapPin, Newspaper, Cloud, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SectionType = 'map' | 'news' | 'weather';

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  className?: string;
}

interface NavigationItem {
  id: SectionType;
  icon: typeof MapPin;
  labelKey: string;
}

export const SidebarNav = ({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
  className,
}: SidebarNavProps) => {
  const { t } = useTranslation();

  const navigationItems: NavigationItem[] = [
    { id: 'map', icon: MapPin, labelKey: 'map.tabs.map' },
    { id: 'news', icon: Newspaper, labelKey: 'map.tabs.news' },
    { id: 'weather', icon: Cloud, labelKey: 'map.tabs.weather' },
  ];

  const handleSectionClick = (section: SectionType) => {
    onSectionChange(section);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 bg-card border-r border-border",
          "w-64 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        aria-label="Sidebar Navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">{t('map.title')}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => handleSectionClick(item.id)}
              >
                <Icon size={20} />
                <span className="font-medium">{t(item.labelKey)}</span>
              </Button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
