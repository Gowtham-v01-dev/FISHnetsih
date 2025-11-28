import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BottomNavigation } from './BottomNavigation';
import { syncService } from '@/services/sync'; 

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  showBottomNav?: boolean;
}

export const MobileLayout = ({ children, className, showBottomNav = true }: MobileLayoutProps) => {
  const [isIndicatorVisible, setIsIndicatorVisible] = useState(!syncService.getStatus().isOnline);

  useEffect(() => {
    const unsubscribe = syncService.subscribe((newStatus) => {
      const isOffline = !newStatus.isOnline;
      // Determine if the "Back Online" banner is showing
      setIsIndicatorVisible(isOffline || newStatus.isOnline !== syncService.getStatus().isOnline);
    });

    return unsubscribe;
  }, []);

  return (
    <div className={cn("flex flex-col h-[100dvh] w-full bg-slate-900", className)}>                             
      <main
        className={cn(
           "flex-1 overflow-y-auto",
            isIndicatorVisible ? "mt-24" : "mt-0" // Simplified top margin for indicator  
        )}
      >
        {children}
      </main>

      {showBottomNav && (
           <footer className="flex-shrink-0 z-40 bg-slate-900/60 backdrop-blur-xl border-t border-sky-400/20">  
          <BottomNavigation />
        </footer>
      )}
    </div>
  );
};