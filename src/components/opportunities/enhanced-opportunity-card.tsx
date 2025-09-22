/**
 * Enhanced Opportunity Card with AI Insights
 * 
 * Displays funding opportunities with AI-powered enhancements,
 * relevance scoring, and additional metadata
 */

"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  Euro, 
  ExternalLink, 
  Brain, 
  Star, 
  CheckCircle,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';
import { type EnhancedOpportunity } from '@/lib/enhanced-api';
import Link from 'next/link';

interface EnhancedOpportunityCardProps {
  opportunity: EnhancedOpportunity;
  showAIInsights?: boolean;
  className?: string;
}

export function EnhancedOpportunityCard({ 
  opportunity, 
  showAIInsights = true, 
  className = "" 
}: EnhancedOpportunityCardProps) {
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-500';
      case 'forthcoming': return 'bg-blue-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-gray-600';
  };

  const formatAmount = (amount: string) => {
    if (!amount || amount === 'Not specified' || amount === 'Amount not specified') {
      return 'Amount TBD';
    }
    return amount;
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader className="space-y-3">
        {/* Header with AI indicator */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
              {opportunity.title}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{opportunity.country}</span>
              <span>•</span>
              <span>{opportunity.subRegion}</span>
            </CardDescription>
          </div>
          
          {/* AI Enhancement Badge */}
          {opportunity.ai_enhanced && showAIInsights && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI Enhanced</span>
            </Badge>
          )}
        </div>

        {/* Status and Metadata */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className={`h-2 w-2 rounded-full ${getStatusColor(opportunity.status)}`} />
            <span className="font-medium">{opportunity.status}</span>
          </div>
          
          {opportunity.call_id && (
            <>
              <span>•</span>
              <span className="text-muted-foreground">ID: {opportunity.call_id}</span>
            </>
          )}
          
          {opportunity.source_plugin && (
            <>
              <span>•</span>
              <span className="text-muted-foreground capitalize">
                {opportunity.source_plugin.replace(/_/g, ' ')}
              </span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Insights Section */}
        {showAIInsights && opportunity.ai_enhanced && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">AI Insights</span>
            </div>
            
            {/* AI Scores */}
            <div className="grid grid-cols-2 gap-3">
              {opportunity.african_relevance_score && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>African Relevance</span>
                    <span className={getRelevanceColor(opportunity.african_relevance_score)}>
                      {opportunity.african_relevance_score}/100
                    </span>
                  </div>
                  <Progress value={opportunity.african_relevance_score} className="h-1" />
                </div>
              )}
              
              {opportunity.quality_score && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Quality Score</span>
                    <span className={getQualityColor(opportunity.quality_score)}>
                      {opportunity.quality_score}/100
                    </span>
                  </div>
                  <Progress value={opportunity.quality_score} className="h-1" />
                </div>
              )}
            </div>

            {/* AI Themes */}
            {opportunity.ai_themes && opportunity.ai_themes.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium">AI-Identified Themes:</span>
                <div className="flex flex-wrap gap-1">
                  {opportunity.ai_themes.slice(0, 3).map((theme, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                  {opportunity.ai_themes.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{opportunity.ai_themes.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-3">
          {/* Summary */}
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {opportunity.ai_summary 
                ? truncateText(opportunity.ai_summary, 200)
                : truncateText(opportunity.summary, 200)
              }
            </p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatAmount(opportunity.fundingAmount)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{opportunity.deadline}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>{opportunity.fundingType}</span>
            </div>
          </div>

          {/* Programme Information */}
          {(opportunity.programme || opportunity.framework_programme) && (
            <div className="p-2 bg-blue-50 rounded text-sm">
              <span className="font-medium text-blue-800">
                Programme: {opportunity.programme || opportunity.framework_programme}
              </span>
            </div>
          )}

          {/* Data Quality Indicator */}
          {opportunity.scraping_metadata && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Data Quality: {opportunity.scraping_metadata.data_quality}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>
                  Updated: {new Date(opportunity.scraping_metadata.scraped_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {opportunity.mipPrios && opportunity.mipPrios.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {opportunity.mipPrios[0]}
              </Badge>
            )}
            
            {opportunity.thematicPrio && opportunity.thematicPrio !== 'Not specified' && (
              <Badge variant="outline" className="text-xs">
                {opportunity.thematicPrio}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* External Link */}
            {opportunity.documents && opportunity.documents.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8"
              >
                <a 
                  href={opportunity.documents[0].url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Source</span>
                </a>
              </Button>
            )}

            {/* View Details */}
            <Button
              variant="default"
              size="sm"
              className="h-8"
              onClick={() => {
                // Open opportunity details in a new tab with URL parameters
                const url = `/dashboard?opportunity=${encodeURIComponent(opportunity.id)}`;
                window.open(url, '_blank');
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
