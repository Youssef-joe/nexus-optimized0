import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { DollarSign, Briefcase, Star, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function ProfessionalDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/professional/profile'],
    enabled: isAuthenticated,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/professional/projects'],
    enabled: isAuthenticated,
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/professional/stats'],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-muted/30">
        <div className="container mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Check if profile exists, if not redirect to setup
  if (!profile && !profileLoading) {
    setLocation('/professional/profile/setup');
    return null;
  }

  const earnings = {
    total: stats?.totalEarnings || 0,
    pending: stats?.pendingEarnings || 0,
    thisMonth: stats?.monthlyEarnings || 0,
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-muted/30">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName || 'Professional'}!
            </p>
          </div>
          <Button className="gap-2 hover-elevate active-elevate-2" onClick={() => setLocation('/professional/services')}>
            <Briefcase className="h-4 w-4" />
            My Services
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-earnings">
                {profile?.currency || 'USD'} {earnings.total.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All-time earnings</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning" data-testid="text-pending-earnings">
                {profile?.currency || 'USD'} {earnings.pending.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">In escrow</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-active-projects">
                {projects?.filter((p: any) => p.status === 'active').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Ongoing work</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-rating">
                {parseFloat(profile?.averageRating || '0').toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {profile?.totalProjects || 0} projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Your current engagements</CardDescription>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              ) : projects && projects.filter((p: any) => p.status === 'active').length > 0 ? (
                <div className="space-y-4">
                  {projects.filter((p: any) => p.status === 'active').map((project: any) => (
                    <div
                      key={project.id}
                      className="p-4 border rounded-lg hover-elevate active-elevate-2 cursor-pointer"
                      onClick={() => setLocation(`/projects/${project.id}`)}
                      data-testid={`card-project-${project.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1 truncate">{project.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {project.company?.companyName || 'Client'}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{project.status}</Badge>
                            {project.totalAmount && (
                              <span className="text-sm font-medium">
                                {project.currency} {parseFloat(project.totalAmount).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="hover-elevate active-elevate-2">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active projects at the moment</p>
                  <Button
                    variant="outline"
                    className="mt-4 hover-elevate active-elevate-2"
                    onClick={() => setLocation('/jobs')}
                  >
                    Browse Jobs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start gap-2 hover-elevate active-elevate-2"
                  variant="outline"
                  onClick={() => setLocation('/messages')}
                  data-testid="button-messages"
                >
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </Button>
                <Button
                  className="w-full justify-start gap-2 hover-elevate active-elevate-2"
                  variant="outline"
                  onClick={() => setLocation('/jobs')}
                  data-testid="button-find-jobs"
                >
                  <Briefcase className="h-4 w-4" />
                  Find Jobs
                </Button>
                <Button
                  className="w-full justify-start gap-2 hover-elevate active-elevate-2"
                  variant="outline"
                  onClick={() => setLocation('/professional/profile')}
                  data-testid="button-edit-profile"
                >
                  <Star className="h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profile Strength</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Profile Completion</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                        <span>Add portfolio items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                        <span>Upload introduction video</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
