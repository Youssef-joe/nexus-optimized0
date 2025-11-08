import { Link, useLocation } from 'wouter';
import { Building2, Briefcase, MessageSquare, User, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageToggle } from './LanguageToggle';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const navItems = isAuthenticated
    ? user?.userType === 'professional'
      ? [
          { label: t('nav.findJobs', 'Find Jobs'), href: '/jobs', icon: Briefcase },
          { label: t('nav.myServices', 'My Services'), href: '/professional/services', icon: Building2 },
          { label: t('nav.messages', 'Messages'), href: '/messages', icon: MessageSquare },
        ]
      : [
          { label: t('nav.findTalent', 'Find Talent'), href: '/professionals', icon: User },
          { label: t('nav.myJobs', 'My Jobs'), href: '/company/jobs', icon: Briefcase },
          { label: t('nav.messages', 'Messages'), href: '/messages', icon: MessageSquare },
        ]
    : [
        { label: t('nav.browseProfessionals', 'Browse Professionals'), href: '/professionals' },
        { label: t('nav.howItWorks', 'How It Works'), href: '#how-it-works' },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 cursor-pointer">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold">L&D Nexus</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for professionals, services, or jobs..."
                  className="pl-10 w-full"
                  data-testid="input-search"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover-elevate active-elevate-2 cursor-pointer ${
                    location === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {'icon' in item && <item.icon className="h-4 w-4 md:hidden" />}
                  <span className="hidden md:inline">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <LanguageToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hover-elevate active-elevate-2"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || 'User'} />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.userType}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={user?.userType === 'professional' ? '/professional/profile' : '/company/profile'} data-testid="link-profile">
                      <div className="w-full flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={user?.userType === 'professional' ? '/professional/dashboard' : '/company/dashboard'} data-testid="link-dashboard">
                      <div className="w-full flex items-center cursor-pointer">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Dashboard
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" className="w-full text-destructive" data-testid="link-logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="hover-elevate active-elevate-2">
                  <a href="/api/login" data-testid="button-login">
                    Log In
                  </a>
                </Button>
                <Button asChild className="hover-elevate active-elevate-2">
                  <a href="/api/login" data-testid="button-signup">
                    Get Started
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
