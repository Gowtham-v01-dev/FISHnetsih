import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Newspaper, Cloud, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MapPage from '@/pages/MapPage';
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

  const navigationItems: NavigationItem[] = [
    { id: 'map', icon: MapPin, labelKey: 'map.tabs.map' },
    { id: 'news', icon: Newspaper, labelKey: 'map.tabs.news' },
    { id: 'weather', icon: Cloud, labelKey: 'map.tabs.weather' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'map':
        return <MapPage key="map" />;
      case 'news':
        return <NewsModule key="news" />;
      case 'weather':
        return <WeatherModule key="weather" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">{t('map.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full overflow-hidden">
          {/* Navigation List */}
          <div className="w-64 border-r bg-background overflow-y-auto">
            <div className="flex flex-col">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`
                      w-full justify-between px-6 py-4 h-auto rounded-none border-b
                      hover:bg-muted/50 transition-colors
                      ${isActive ? 'bg-muted/50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}
                    `}
                    onClick={() => setActiveSection(item.id)}
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

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full w-full">
              {renderContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
