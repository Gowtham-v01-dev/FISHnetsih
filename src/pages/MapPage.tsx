import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Newspaper, Cloud, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CatchMap } from '@/components/map/CatchMap';
import { NewsModule } from '@/components/map/NewsModule';
import { WeatherModule } from '@/components/map/WeatherModule';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SectionType = 'map' | 'news' | 'weather';

interface NavigationItem {
  id: SectionType;
  icon: typeof MapPin;
  labelKey: string;
}

export default function MapPage() {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (activeSection === 'map') {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  useEffect(() => {
    if (shouldFocus && tabRefs.current[activeSection]) {
      tabRefs.current[activeSection]?.focus();
      setShouldFocus(false);
    }
  }, [activeSection, shouldFocus]);

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
    <div className="h-screen flex flex-col bg-background">
      <header className="flex-shrink-0 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{t('map.title')}</h1>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="World's View sections"
          className="flex border-t border-border"
        >
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
                className={cn(
                  "flex-1 rounded-none py-3 h-auto border-b-2 transition-all duration-200",
                  isActive
                    ? "border-b-primary text-primary bg-primary/5"
                    : "border-b-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                onClick={() => setActiveSection(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} />
                  <span className="font-medium">{t(item.labelKey)}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative">
        <div
          role="tabpanel"
          id="map-panel"
          aria-labelledby="map-tab"
          className={cn("h-full w-full", activeSection === 'map' ? 'block' : 'hidden')}
        >
          <CatchMap className="h-full w-full" />
        </div>
        <div
          role="tabpanel"
          id="news-panel"
          aria-labelledby="news-tab"
          className={cn("h-full w-full overflow-hidden", activeSection === 'news' ? 'block' : 'hidden')}
        >
          <NewsModule />
        </div>
        <div
          role="tabpanel"
          id="weather-panel"
          aria-labelledby="weather-tab"
          className={cn("h-full w-full", activeSection === 'weather' ? 'block' : 'hidden')}
        >
          <WeatherModule />
        </div>
      </div>
    </div>
  );
}
