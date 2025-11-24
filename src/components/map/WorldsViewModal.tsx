import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Newspaper, Cloud } from 'lucide-react';
import MapPage from '@/pages/MapPage';
import { NewsModule } from './NewsModule';
import { WeatherModule } from './WeatherModule';

interface WorldsViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WorldsViewModal = ({ open, onOpenChange }: WorldsViewModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">{t('map.title')}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 h-full">
          <div className="flex flex-col">
            {/* Map Section */}
            <div className="border-b">
              <div className="px-6 py-4 bg-muted/30">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin size={20} className="text-primary" />
                  {t('map.tabs.map')}
                </h3>
              </div>
              <div className="h-[500px]">
                <MapPage />
              </div>
            </div>

            {/* News Section */}
            <div className="border-b">
              <div className="px-6 py-4 bg-muted/30">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Newspaper size={20} className="text-primary" />
                  {t('map.tabs.news')}
                </h3>
              </div>
              <div className="h-[500px]">
                <NewsModule />
              </div>
            </div>

            {/* Weather Section */}
            <div>
              <div className="px-6 py-4 bg-muted/30">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Cloud size={20} className="text-primary" />
                  {t('map.tabs.weather')}
                </h3>
              </div>
              <div className="h-[500px]">
                <WeatherModule />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
