import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Plus, Briefcase, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function CompanyDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['/api/company/profile'],
    enabled: isAuthenticated,
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/company/jobs'],
    enabled: isAuthenticated,
  });

  const { data: projects } = useQuery({
    queryKey: ['/api/company/projects'],
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

  if (authLoading || companyLoading) {
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

  // Check if company exists, if not redirect to setup
  if (!company && !companyLoading) {
    setLocation('/company/profile/setup');
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-muted/30">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground">
              {company?.companyName || 'Your Company'}
            </p>
          </div>
          <Button className="gap-2 hover-elevate active-elevate-2" onClick={() => setLocation('/company/jobs/new')}>
            <Plus className="h-4 w-4" />
            Post Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-active-jobs">
                {jobs?.filter((j: any) => j.isPublic).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Open positions</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hired Professionals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-hired-professionals">
                {projects?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Total engagements</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success" data-testid="text-active-projects">
                {projects?.filter((p: any) => p.status === 'active').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-spent">
                USD 0
              </div>
              <p className="text-xs text-muted-foreground">All-time investment</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Posted Jobs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Posted Jobs</CardTitle>
                  <CardDescription>Your active and recent job postings</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setLocation('/company/jobs')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              ) : jobs && jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job: any) => (
                    <div
                      key={job.id}
                      className="p-4 border rounded-lg hover-elevate active-elevate-2 cursor-pointer"
                      onClick={() => setLocation(`/jobs/${job.id}`)}
                      data-testid={`card-job-${job.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1 truncate">{job.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {job.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant={job.isPublic ? 'default' : 'secondary'}>
                              {job.isPublic ? 'Public' : 'Private'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {job.applicationCount || 0} applications
                            </span>
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
                  <p>No jobs posted yet</p>
                  <Button
                    className="mt-4 hover-elevate active-elevate-2"
                    onClick={() => setLocation('/company/jobs/new')}
                  >
                    Post Your First Job
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
                  onClick={() => setLocation('/company/jobs/new')}
                  data-testid="button-post-job"
                >
                  <Plus className="h-4 w-4" />
                  Post New Job
                </Button>
                <Button
                  className="w-full justify-start gap-2 hover-elevate active-elevate-2"
                  variant="outline"
                  onClick={() => setLocation('/professionals')}
                  data-testid="button-browse-talent"
                >
                  <Users className="h-4 w-4" />
                  Browse Talent
                </Button>
                <Button
                  className="w-full justify-start gap-2 hover-elevate active-elevate-2"
                  variant="outline"
                  onClick={() => setLocation('/company/profile')}
                  data-testid="button-edit-company"
                >
                  <Briefcase className="h-4 w-4" />
                  Edit Company Profile
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Welcome to L&D Nexus!</p>
                      <p className="text-muted-foreground">Complete your company profile to get started</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
