import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Upload, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(500),
  location: z.string().min(2, 'Location is required'),
  timezone: z.string().min(2, 'Timezone is required'),
  hourlyRate: z.string().min(1, 'Hourly rate is required'),
  currency: z.string().default('USD'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfessionalProfileSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [newLanguage, setNewLanguage] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: '',
      location: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hourlyRate: '',
      currency: 'USD',
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues & { languages: string[] }) => {
      return await apiRequest('POST', '/api/professional/profile', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: 'Profile created!',
        description: 'Your professional profile has been set up successfully.',
      });
      setLocation('/professional/dashboard');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    createProfileMutation.mutate({ ...data, languages });
  };

  const addLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-muted/30">
      <div className="max-w-3xl mx-auto space-y-8 animate-slide-in-bottom">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-display">Complete Your Profile</h1>
          <p className="text-muted-foreground">Let companies know about your expertise and experience</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about yourself and your professional background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your experience, expertise, and what makes you unique..."
                          className="min-h-32 resize-none"
                          data-testid="input-bio"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value.length}/500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Dubai, UAE" data-testid="input-location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Asia/Dubai" data-testid="input-timezone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Languages */}
                <div className="space-y-3">
                  <FormLabel>Languages</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="gap-1">
                        {lang}
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a language"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                      data-testid="input-language"
                    />
                    <Button type="button" onClick={addLanguage} variant="outline" data-testid="button-add-language">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set your hourly rate (you can change this later)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-currency">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="AED">AED (د.إ)</SelectItem>
                            <SelectItem value="SAR">SAR (﷼)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Hourly Rate</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 150"
                            data-testid="input-hourly-rate"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your standard hourly rate for training and consulting
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={createProfileMutation.isPending}
                className="gap-2 hover-elevate active-elevate-2"
                data-testid="button-submit"
              >
                {createProfileMutation.isPending ? 'Creating Profile...' : 'Complete Setup'}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
