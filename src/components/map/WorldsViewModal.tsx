import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Newspaper, Cloud, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CatchMap } from './CatchMap';
import { NewsModule } from './NewsModule';
import { WeatherModule } from './WeatherModule';

interface WorldsViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SectionType = 'map' | 'news' | 'weather';

interface NavigationItem {
  id: SectionType;
  icon: typeof MapPin;
  labelKey: string;
}

export const WorldsViewModal = ({ open, onOpenChange }: WorldsViewModalProps) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<SectionType>('map');
  const [shouldFocus, setShouldFocus] = useState(false);
  const tabRefs = useRef<Record<SectionType, HTMLButtonElement | null>>({
    map: null,
    news: null,
    weather: null,
  });

  const navigationItems: NavigationItem[] = [
    { id: 'map', icon: MapPin, labelKey: 'map.tabs.map' },
    { id: 'news', icon: Newspaper, labelKey: 'map.tabs.news' },
    { id: 'weather', icon: Cloud, labelKey: 'map.tabs.weather' },
  ];

  // Trigger map resize when switching to map tab
  useEffect(() => {
    if (activeSection === 'map' && open) {
      // Delay to allow modal to fully render before resizing map
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeSection, open]);

  // Focus management after state updates
  useEffect(() => {
    if (shouldFocus && tabRefs.current[activeSection]) {
      tabRefs.current[activeSection]?.focus();
      setShouldFocus(false);
    }
  }, [activeSection, shouldFocus]);

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : navigationItems.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < navigationItems.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = navigationItems.length - 1;
        break;
      default:
        return;
    }

    setActiveSection(navigationItems[newIndex].id);
    setShouldFocus(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-[95vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-4 pb-3 border-b flex-shrink-0">
          <DialogTitle className="text-2xl font-bold">{t('map.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Navigation List */}
          <div className="w-64 border-r bg-background overflow-y-auto">
            <div role="tablist" aria-label="World's View sections" className="flex flex-col">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <Button
                    key={item.id}
                    ref={(el) => { tabRefs.current[item.id] = el; }}
                    id={`${item.id}-tab`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${item.id}-panel`}
                    tabIndex={isActive ? 0 : -1}
                    variant="ghost"
                    className={`
                      w-full justify-between px-6 py-4 h-auto rounded-none border-b
                      hover:bg-muted/50 transition-colors
                      ${isActive ? 'bg-muted/50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}
                    `}
                    onClick={() => setActiveSection(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon 
                        size={20} 
                        className={isActive ? 'text-primary' : 'text-muted-foreground'} 
                      />
                      <span className={`text-base ${isActive ? 'font-semibold' : 'font-normal'}`}>
                        {t(item.labelKey)}
                      </span>
                    </div>
                    <ChevronRight 
                      size={20} 
                      className={isActive ? 'text-primary' : 'text-muted-foreground'} 
                    />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Content Area - All panels rendered, inactive ones hidden */}
          <div className="flex-1 overflow-hidden relative">
            <div 
              role="tabpanel" 
              id="map-panel"
              aria-labelledby="map-tab"
              className={`h-full w-full ${activeSection === 'map' ? 'block' : 'hidden'}`}
            >
              <CatchMap className="h-full w-full" />
            </div>
            <div 
              role="tabpanel" 
              id="news-panel"
              aria-labelledby="news-tab"
              className={`h-full w-full ${activeSection === 'news' ? 'block' : 'hidden'}`}
            >
              <NewsModule />
            </div>
            <div 
              role="tabpanel" 
              id="weather-panel"
              aria-labelledby="weather-tab"
              className={`h-full w-full ${activeSection === 'weather' ? 'block' : 'hidden'}`}
            >
              <WeatherModule />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
