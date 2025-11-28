import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Newspaper, Cloud, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CatchMap } from '@/components/map/CatchMap';
import { NewsModule } from '@/components/map/NewsModule';
import { WeatherModule } from '@/components/map/WeatherModule';
import { cn } from '@/lib/utils';

type SectionType = 'map' | 'news' | 'weather';

interface NavigationItem {
  id: SectionType;
  icon: any;
  labelKey: string;
}

export default function MapPage() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<SectionType>('map');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems: NavigationItem[] = [
    { id: 'map', icon: MapPin, labelKey: 'map.tabs.map' },
    { id: 'news', icon: Newspaper, labelKey: 'map.tabs.news' },
    { id: 'weather', icon: Cloud, labelKey: 'map.tabs.weather' },
  ];

  // Fix CatchMap incorrect size on visibility change
  useEffect(() => {
    if (activeSection === 'map') {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 bg-card/80 backdrop-blur-md border-b border-border z-20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">{t('map.title')}</h1>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-30 transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">{t('map.title')}</h2>
        </div>

        <nav className="flex flex-col p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  isActive
                    ? "bg-muted text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted/70"
                )}
              >
                <Icon className="w-5 h-5" />
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-hidden relative transition-all duration-300 ease-in-out",
          isSidebarOpen ? "sm:ml-64" : "ml-0"
        )}
      >
        {/* MAP PANEL */}
        <div
          role="tabpanel"
          id="map-panel"
          aria-labelledby="map-tab"
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-300",
            activeSection === 'map'
              ? "z-10 opacity-100"
              : "z-0 opacity-0 pointer-events-none"
          )}
        >
          <CatchMap className="h-full w-full" />
        </div>

        {/* NEWS PANEL */}
        <div
          role="tabpanel"
          id="news-panel"
          aria-labelledby="news-tab"
          className={cn(
            "absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-300",
            activeSection === 'news'
              ? "z-10 opacity-100"
              : "z-0 opacity-0 pointer-events-none"
          )}
        >
          <NewsModule />
        </div>

        {/* WEATHER PANEL */}
        <div
          role="tabpanel"
          id="weather-panel"
          aria-labelledby="weather-tab"
          className={cn(
            "absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-300",
            activeSection === 'weather'
              ? "z-10 opacity-100"
              : "z-0 opacity-0 pointer-events-none"
          )}
        >
          <WeatherModule />
        </div>
      </main>
    </div>
  );
}
