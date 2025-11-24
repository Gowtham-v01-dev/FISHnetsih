import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('map');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">{t('map.title')}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
          <TabsList className="mx-6 grid w-full grid-cols-3">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{t('map.tabs.map')}</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper size={18} />
              <span>{t('map.tabs.news')}</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <Cloud size={18} />
              <span>{t('map.tabs.weather')}</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="map" className="h-full mt-0 data-[state=active]:flex">
              <div className="w-full h-full">
                <MapPage />
              </div>
            </TabsContent>

            <TabsContent value="news" className="h-full mt-0 data-[state=active]:flex">
              <NewsModule />
            </TabsContent>

            <TabsContent value="weather" className="h-full mt-0 data-[state=active]:flex">
              <WeatherModule />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
