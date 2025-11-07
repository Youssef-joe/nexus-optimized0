import { Building2, MapPin, DollarSign, Calendar, Clock, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import type { Job } from '@shared/schema';

interface JobCardProps {
  job: Job & {
    company?: {
      companyName?: string | null;
      logoUrl?: string | null;
    };
  };
  onClick?: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  const companyName = job.company?.companyName || 'Company';

  return (
    <Card 
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={onClick}
      data-testid={`card-job-${job.id}`}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <Avatar className="h-12 w-12 rounded-md">
              <AvatarImage src={job.company?.logoUrl || undefined} alt={companyName} />
              <AvatarFallback className="rounded-md">
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg truncate" data-testid="text-job-title">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground">{companyName}</p>
              </div>
              
              {/* Badges */}
              <div className="flex gap-1 flex-shrink-0">
                {job.isUrgent && (
                  <Badge variant="destructive" className="text-xs gap-1">
                    <Zap className="h-3 w-3" />
                    Urgent
                  </Badge>
                )}
                {job.isFeatured && (
                  <Badge className="text-xs">
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {job.description}
            </p>

            {/* Skills */}
            {job.skillsRequired && job.skillsRequired.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {job.skillsRequired.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skillsRequired.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.skillsRequired.length - 5}
                  </Badge>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {job.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span data-testid="text-job-budget">
                    {job.currency} {parseFloat(job.budget).toFixed(0)}
                  </span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="capitalize">{job.deliveryFormat}</span>
                </div>
              )}
              {job.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{job.duration}</span>
                </div>
              )}
              {job.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Due {formatDistanceToNow(new Date(job.deadline), { addSuffix: true })}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
              <span>
                Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </span>
              {job.applicationCount > 0 && (
                <span>{job.applicationCount} applications</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
