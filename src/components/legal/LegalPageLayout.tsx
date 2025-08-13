import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LegalPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to App</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-2">
                <img src="/lovable-uploads/logo.jpg" alt="PediaPredict Logo" className="h-8 w-8" />
                <span className="font-semibold text-foreground">PediaPredict</span>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal & Compliance</h3>
              <div className="space-y-2 text-sm">
                <Link to="/legal/privacy" className="block text-muted-foreground hover:text-primary">Privacy Policy</Link>
                <Link to="/legal/terms" className="block text-muted-foreground hover:text-primary">Terms of Service</Link>
                <Link to="/legal/medical-disclaimer" className="block text-muted-foreground hover:text-primary">Medical Disclaimer</Link>
                <Link to="/legal/cookies" className="block text-muted-foreground hover:text-primary">Cookie Policy</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Transparency</h3>
              <div className="space-y-2 text-sm">
                <Link to="/legal/ai-transparency" className="block text-muted-foreground hover:text-primary">AI Transparency</Link>
                <Link to="/legal/security" className="block text-muted-foreground hover:text-primary">Security Practices</Link>
                <Link to="/legal/data-deletion" className="block text-muted-foreground hover:text-primary">Data Deletion</Link>
                <Link to="/legal/about" className="block text-muted-foreground hover:text-primary">About Us</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Email: support@doutly.com</p>
                <p>Response time: 24-48 hours</p>
                <Link to="/legal/contact" className="block text-primary hover:text-primary/80">Contact & Support</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 PediaPredict by Doutly. All rights reserved.</p>
            <p className="mt-2">Powered by JSS Science and Technology University & JSS Academy of Higher Education & Research</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalPageLayout;