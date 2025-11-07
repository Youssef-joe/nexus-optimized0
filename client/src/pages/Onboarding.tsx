import { useState } from 'react';
import { useLocation } from 'wouter';
import { Building2, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<'professional' | 'company' | null>(null);
  const { toast } = useToast();

  const updateUserTypeMutation = useMutation({
    mutationFn: async (userType: 'professional' | 'company') => {
      return await apiRequest('POST', '/api/user/type', { userType });
    },
    onSuccess: (_, userType) => {
      toast({
        title: 'Account type selected',
        description: `You've joined as a ${userType === 'professional' ? 'Professional' : 'Company'}`,
      });
      setLocation(userType === 'professional' ? '/professional/profile/setup' : '/company/profile/setup');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update account type. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleContinue = () => {
    if (selectedType) {
      updateUserTypeMutation.mutate(selectedType);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-4xl space-y-8 animate-slide-in-bottom">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold font-display">Welcome to L&D Nexus</h1>
          <p className="text-xl text-muted-foreground">Choose how you'd like to use the platform</p>
        </div>

        {/* Account Type Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Professional Card */}
          <Card
            className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${
              selectedType === 'professional'
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                : ''
            }`}
            onClick={() => setSelectedType('professional')}
            data-testid="card-select-professional"
          >
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">I'm a Professional</CardTitle>
              <CardDescription className="text-base">
                Offer training, coaching, and L&D services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Create a professional profile and showcase your expertise</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Get matched with relevant job opportunities</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Manage projects and receive secure payments</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Build your reputation with reviews and ratings</span>
              </div>
            </CardContent>
          </Card>

          {/* Company Card */}
          <Card
            className={`cursor-pointer transition-all hover-elevate active-elevate-2 ${
              selectedType === 'company' ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
            }`}
            onClick={() => setSelectedType('company')}
            data-testid="card-select-company"
          >
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mx-auto mb-4">
                <Building2 className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">I'm a Company</CardTitle>
              <CardDescription className="text-base">
                Find and hire top L&D professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-accent-foreground flex-shrink-0" />
                <span>Post training needs and project requirements</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-accent-foreground flex-shrink-0" />
                <span>Get AI-powered professional recommendations</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-accent-foreground flex-shrink-0" />
                <span>Manage team members and track projects</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-accent-foreground flex-shrink-0" />
                <span>Secure payments with escrow and milestone tracking</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedType || updateUserTypeMutation.isPending}
            className="px-12 gap-2 hover-elevate active-elevate-2"
            data-testid="button-continue"
          >
            {updateUserTypeMutation.isPending ? 'Setting up...' : 'Continue'}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
