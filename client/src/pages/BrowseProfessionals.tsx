import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfessionalCard } from '@/components/ProfessionalCard';
import { useLocation } from 'wouter';

export default function BrowseProfessionals() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');

  const { data: professionals, isLoading } = useQuery({
    queryKey: ['/api/professionals', searchQuery, filterLocation, filterLanguage],
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-display">Discover L&D Professionals</h1>
          <p className="text-muted-foreground">
            Browse verified trainers, coaches, and learning & development experts
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-background/50 backdrop-blur-sm sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by skills, name, or expertise..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-professionals"
              />
            </div>

            {/* Location Filter */}
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-filter-location">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="UAE">UAE</SelectItem>
                <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                <SelectItem value="Qatar">Qatar</SelectItem>
                <SelectItem value="Kuwait">Kuwait</SelectItem>
              </SelectContent>
            </Select>

            {/* Language Filter */}
            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-filter-language">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="Both">Bilingual</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2 hover-elevate active-elevate-2" data-testid="button-more-filters">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {professionals?.length || 0} professionals found
          </p>
          <Select defaultValue="rating">
            <SelectTrigger className="w-48" data-testid="select-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : professionals && professionals.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional: any) => (
              <ProfessionalCard
                key={professional.id}
                profile={professional}
                onClick={() => setLocation(`/professionals/${professional.id}`)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No professionals found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters to find more results.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setFilterLocation('all');
                  setFilterLanguage('all');
                }}
                className="hover-elevate active-elevate-2"
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
