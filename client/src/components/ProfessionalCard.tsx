import { Star, MapPin, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { ProfessionalProfile } from '@shared/schema';

interface ProfessionalCardProps {
  profile: ProfessionalProfile & {
    user?: {
      firstName?: string | null;
      lastName?: string | null;
      profileImageUrl?: string | null;
    };
  };
  onClick?: () => void;
}

export function ProfessionalCard({ profile, onClick }: ProfessionalCardProps) {
  const fullName = profile.user?.firstName && profile.user?.lastName
    ? `${profile.user.firstName} ${profile.user.lastName}`
    : 'Professional';

  const rating = parseFloat(profile.averageRating || '0');

  return (
    <Card 
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={onClick}
      data-testid={`card-professional-${profile.id}`}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar with Status */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.user?.profileImageUrl || undefined} alt={fullName} />
              <AvatarFallback className="text-lg">
                {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {profile.verificationStatus === 'verified' && (
              <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-1">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name and Badges */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-lg truncate" data-testid="text-professional-name">
                  {fullName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {profile.isTopRated && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      Top Rated
                    </Badge>
                  )}
                  {profile.isTrending && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Rating */}
              {rating > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm" data-testid="text-rating">
                    {rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {profile.bio || 'Experienced learning and development professional'}
            </p>

            {/* Skills/Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {profile.languages.slice(0, 4).map((lang, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
                {profile.languages.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.languages.length - 4}
                  </Badge>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Responds in ~{profile.responseTime}h</span>
              </div>
              {profile.totalProjects > 0 && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{profile.totalProjects} projects</span>
                </div>
              )}
            </div>

            {/* Price */}
            {profile.hourlyRate && (
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hourly Rate</span>
                <span className="font-semibold" data-testid="text-price">
                  {profile.currency} {parseFloat(profile.hourlyRate).toFixed(0)}/hr
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full mt-4 hover-elevate active-elevate-2" data-testid="button-view-profile">
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
