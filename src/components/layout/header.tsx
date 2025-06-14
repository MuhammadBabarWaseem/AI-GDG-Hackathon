import Link from 'next/link';
import LogoIcon from '@/components/icons/logo-icon';

const AppHeader = () => {
  return (
    <header className="bg-card border-b border-border shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <LogoIcon className="h-9 w-9 text-primary transition-transform duration-300 group-hover:scale-110" />
          <div>
            <h1 className="text-2xl font-headline font-bold text-primary transition-colors duration-300 group-hover:text-primary/80">SmartCart</h1>
            <p className="text-xs text-muted-foreground font-body transition-colors duration-300 group-hover:text-accent">Shop smarter. Sell better. Powered by AI.</p>
          </div>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
};

export default AppHeader;
