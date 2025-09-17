"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Search } from 'lucide-react';

export interface OpportunityFilters {
  country?: string;
  thematic_priority?: string;
  funding_cycle?: string;
  subregion?: string;
  funding_type?: 'Development' | 'Humanitarian' | 'All';
  search?: string;
}

interface OpportunityFiltersProps {
  filters: OpportunityFilters;
  onFiltersChange: (filters: OpportunityFilters) => void;
  onSearch: () => void;
  onClear: () => void;
}

const COUNTRIES = [
  'All Countries',
  'Benin',
  'Burkina Faso',
  'Cameroon',
  'Chad',
  'Côte d\'Ivoire',
  'Ghana',
  'Guinea',
  'Liberia',
  'Mali',
  'Niger',
  'Nigeria',
  'Senegal',
  'Sierra Leone',
  'Togo',
  'Sub-Saharan Africa',
  'European Union',
  'Multiple',
  'Not specified'
];

const THEMATIC_PRIORITIES = [
  'All Priorities',
  'Sustainable economic growth',
  'Green and digital transition',
  'Human development',
  'Governance and rule of law',
  'Migration and mobility',
  'Security and stability',
  'Climate action',
  'Digital transformation',
  'Education and training',
  'Health and social protection',
  'Agriculture and rural development',
  'Infrastructure and connectivity',
  'Private sector development',
  'Civil society and media',
  'Youth and gender equality'
];

const FUNDING_CYCLES = [
  'All Cycles',
  '2021-2024',
  '2024-2027',
  '2025-2028',
  '2026-2029',
  '2027-2030'
];

const SUBREGIONS = [
  'All Subregions',
  'West Africa',
  'Central Africa',
  'East Africa',
  'Southern Africa',
  'Horn of Africa',
  'Sahel',
  'Gulf of Guinea',
  'Great Lakes',
  'Africa'
];

const FUNDING_TYPES = [
  'All Types',
  'Development',
  'Humanitarian'
];

export function OpportunityFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  onClear 
}: OpportunityFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof OpportunityFilters, value: string) => {
    const newFilters = { ...filters };
    if (value === 'All Countries' || value === 'All Priorities' || value === 'All Cycles' || value === 'All Subregions' || value === 'All Types') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFiltersChange(newFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== '').length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Opportunities</Label>
          <div className="flex gap-2">
            <Input
              id="search"
              placeholder="Search by title, description, or keywords..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            />
            <Button onClick={onSearch} className="px-6">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={filters.country || 'All Countries'}
              onValueChange={(value) => handleFilterChange('country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="funding_type">Funding Type</Label>
            <Select
              value={filters.funding_type || 'All Types'}
              onValueChange={(value) => handleFilterChange('funding_type', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {FUNDING_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subregion">Subregion</Label>
            <Select
              value={filters.subregion || 'All Subregions'}
              onValueChange={(value) => handleFilterChange('subregion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subregion" />
              </SelectTrigger>
              <SelectContent>
                {SUBREGIONS.map((subregion) => (
                  <SelectItem key={subregion} value={subregion}>
                    {subregion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="funding_cycle">Funding Cycle</Label>
            <Select
              value={filters.funding_cycle || 'All Cycles'}
              onValueChange={(value) => handleFilterChange('funding_cycle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                {FUNDING_CYCLES.map((cycle) => (
                  <SelectItem key={cycle} value={cycle}>
                    {cycle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters - Expandable */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-sm text-muted-foreground">Advanced Filters</h4>
            
            <div className="space-y-2">
              <Label htmlFor="thematic_priority">Thematic Priority</Label>
              <Select
                value={filters.thematic_priority || 'All Priorities'}
                onValueChange={(value) => handleFilterChange('thematic_priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select thematic priority" />
                </SelectTrigger>
                <SelectContent>
                  {THEMATIC_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === '') return null;
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {key}: {value}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => handleFilterChange(key as keyof OpportunityFilters, '')}
                    />
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
