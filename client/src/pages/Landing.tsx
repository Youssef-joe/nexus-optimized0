import { ArrowRight, CheckCircle2, Users, Briefcase, Star, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8 animate-slide-in-bottom">
              <div className="inline-block">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Globe className="h-4 w-4" />
                  <span>Bilingual Marketplace • English & Arabic</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-display">
                Connect with Top
                <span className="text-primary block">L&D Professionals</span>
                Across MENA
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                AI-powered marketplace connecting companies with certified trainers, coaches, and learning & development experts. Find the perfect match for your training needs.
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                <Input
                  type="search"
                  placeholder="Search for skills, trainers, or services..."
                  className="flex-1 h-12"
                  data-testid="input-hero-search"
                />
                <Button size="lg" className="h-12 px-8 gap-2 hover-elevate active-elevate-2" data-testid="button-search">
                  Search
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="gap-2 hover-elevate active-elevate-2" 
                  asChild
                >
                  <a href="/api/login" data-testid="button-find-talent">
                    <Users className="h-5 w-5" />
                    Find Talent
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 hover-elevate active-elevate-2"
                  asChild
                >
                  <a href="/api/login" data-testid="button-offer-services">
                    <Briefcase className="h-5 w-5" />
                    Offer Your Services
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8 border-t">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Verified Professionals</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">1,200+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">4.9</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Right: Visual Element */}
            <div className="hidden lg:block animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-3xl" />
                <Card className="relative bg-gradient-to-br from-card to-card/50 border-2">
                  <CardContent className="p-8 space-y-6">
                    {/* Sample Professional Cards */}
                    <div className="space-y-4">
                      {[
                        { name: 'Sarah Al-Rashid', role: 'Leadership Coach', rating: 5.0, projects: 43 },
                        { name: 'Ahmed Hassan', role: 'Training Designer', rating: 4.9, projects: 67 },
                        { name: 'Fatima Al-Mansouri', role: 'Corporate Trainer', rating: 4.8, projects: 52 },
                      ].map((pro, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-lg border">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold">
                            {pro.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{pro.name}</div>
                            <div className="text-sm text-muted-foreground">{pro.role}</div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {pro.rating}
                            </div>
                            <div className="text-xs text-muted-foreground">{pro.projects} projects</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Get matched with the perfect L&D professional in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* For Companies */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 border-b">
                <h3 className="text-2xl font-bold mb-2">For Companies</h3>
                <p className="text-muted-foreground">Find and hire top L&D talent</p>
              </div>
              <CardContent className="p-6 space-y-4">
                {[
                  { step: 1, title: 'Post Your Training Need', desc: 'Describe your project, budget, and requirements' },
                  { step: 2, title: 'Get AI-Matched Professionals', desc: 'Receive personalized recommendations based on your needs' },
                  { step: 3, title: 'Hire & Manage', desc: 'Chat, negotiate, and track project progress with ease' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* For Professionals */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-accent/20 to-transparent p-6 border-b">
                <h3 className="text-2xl font-bold mb-2">For Professionals</h3>
                <p className="text-muted-foreground">Grow your business and reach new clients</p>
              </div>
              <CardContent className="p-6 space-y-4">
                {[
                  { step: 1, title: 'Create Your Profile', desc: 'Showcase your expertise, certifications, and portfolio' },
                  { step: 2, title: 'Receive Job Matches', desc: 'Get AI-powered recommendations for relevant opportunities' },
                  { step: 3, title: 'Deliver & Earn', desc: 'Complete projects and receive secure payments with escrow' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">Why Choose L&D Nexus</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to succeed in the L&D marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: 'AI-Powered Matching',
                desc: 'Advanced algorithms match you with the perfect opportunities or talent based on skills, experience, and needs',
              },
              {
                icon: CheckCircle2,
                title: 'Verified Professionals',
                desc: 'All trainers are verified with credentials, certifications, and portfolio reviews',
              },
              {
                icon: Globe,
                title: 'Bilingual Support',
                desc: 'Full support for English and Arabic with seamless language switching and RTL layout',
              },
              {
                icon: Briefcase,
                title: 'Secure Payments',
                desc: 'Escrow-protected payments with milestone tracking and multi-currency support',
              },
              {
                icon: Users,
                title: 'Real-time Collaboration',
                desc: 'Built-in messaging, file sharing, and project management tools',
              },
              {
                icon: Star,
                title: 'Quality Assurance',
                desc: 'Rating and review system ensures transparency and quality for every project',
              },
            ].map((feature, i) => (
              <Card key={i} className="text-center p-6 hover-elevate transition-all">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold font-display">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of companies and professionals transforming learning & development across MENA
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" className="gap-2 hover-elevate active-elevate-2" asChild>
                <a href="/api/login" data-testid="button-cta-signup">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="hover-elevate active-elevate-2">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="font-display font-bold">L&D Nexus</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 L&D Nexus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
