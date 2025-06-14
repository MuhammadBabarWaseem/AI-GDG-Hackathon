import Link from 'next/link';
import LogoIcon from '@/components/icons/logo-icon';

const AppHeader = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <LogoIcon className="h-8 w-8 text-primary group-hover:text-accent transition-colors" />
          <div>
            <h1 className="text-2xl font-headline font-bold text-primary group-hover:text-accent transition-colors">ShopMate AI</h1>
            <p className="text-xs text-muted-foreground font-body group-hover:text-accent transition-colors">Shop smarter. Sell better. Powered by AI.</p>
          </div>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
};

export default AppHeader;
