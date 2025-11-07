import { Clock, DollarSign, Video, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Service } from '@shared/schema';

interface ServiceCardProps {
  service: Service & {
    profile?: {
      user?: {
        firstName?: string | null;
        lastName?: string | null;
        profileImageUrl?: string | null;
      };
    };
  };
  onClick?: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const providerName = service.profile?.user?.firstName && service.profile?.user?.lastName
    ? `${service.profile.user.firstName} ${service.profile.user.lastName}`
    : 'Professional';

  const formatIcon = {
    'virtual': Video,
    'in-person': MapPin,
    'hybrid': Video,
  };

  const FormatIcon = formatIcon[service.format] || Video;

  return (
    <Card 
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all flex flex-col"
      onClick={onClick}
      data-testid={`card-service-${service.id}`}
    >
      {/* Thumbnail */}
      {service.mediaUrls && service.mediaUrls.length > 0 ? (
        <div className="aspect-video bg-muted relative overflow-hidden">
          <img
            src={service.mediaUrls[0]}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 left-2" variant="secondary">
            {service.category}
          </Badge>
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
          <FormatIcon className="h-12 w-12 text-primary/40" />
          <Badge className="absolute top-2 left-2" variant="secondary">
            {service.category}
          </Badge>
        </div>
      )}

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-2 mb-2" data-testid="text-service-title">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
          {service.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
          {service.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{service.duration}h</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <FormatIcon className="h-3 w-3" />
            <span className="capitalize">{service.format}</span>
          </div>
        </div>

        {/* Provider */}
        <div className="flex items-center gap-2 pt-3 border-t">
          <Avatar className="h-6 w-6">
            <AvatarImage src={service.profile?.user?.profileImageUrl || undefined} />
            <AvatarFallback className="text-xs">
              {providerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{providerName}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t">
        <span className="text-xs text-muted-foreground capitalize">{service.pricingModel}</span>
        {service.price && (
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold" data-testid="text-service-price">
              {service.currency} {parseFloat(service.price).toFixed(0)}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
