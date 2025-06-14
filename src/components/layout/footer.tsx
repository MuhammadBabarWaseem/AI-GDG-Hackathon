const AppFooter = () => {
  return (
    <footer className="bg-card border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} SmartCart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
