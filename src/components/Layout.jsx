
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Layout = ({ children, hasNewOrder, clearNewOrderNotification, hasFailedPost, clearFailedPostNotification }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileMenuOpen(false); 
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <div className="hidden md:flex fixed top-0 left-0 h-full z-20">
        <Sidebar 
          onLinkClick={handleLinkClick} 
          hasNewOrder={hasNewOrder} 
          clearNewOrderNotification={clearNewOrderNotification}
          hasFailedPost={hasFailedPost}
          clearFailedPostNotification={clearFailedPostNotification}
        />
      </div>
      
      <div className="md:hidden fixed top-0 left-0 z-30 p-4">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-card border-border">
              <Menu className="h-6 w-6 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-background border-r border-border">
            <Sidebar 
              onLinkClick={handleLinkClick} 
              hasNewOrder={hasNewOrder} 
              clearNewOrderNotification={clearNewOrderNotification}
              hasFailedPost={hasFailedPost}
              clearFailedPostNotification={clearFailedPostNotification}
            />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 md:ml-64 pt-16 md:pt-6 pb-6 px-4 md:px-8 overflow-auto">
        <div className="max-w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
