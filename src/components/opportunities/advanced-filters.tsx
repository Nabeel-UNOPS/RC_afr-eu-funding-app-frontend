"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  SearchFilters, 
  AFRICAN_COUNTRIES, 
  SUBREGIONS, 
  THEMATIC_PRIORITIES, 
  FUNDING_CYCLES, 
  FUNDING_TYPES, 
  STATUS_OPTIONS, 
  PROGRAMME_PERIODS,
  BUDGET_RANGES
} from '@/lib/filters';

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  totalResults: number;
  filteredResults: number;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalResults,
  filteredResults
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (key: keyof SearchFilters, value: string, checked: boolean) => {
    const currentArray = (localFilters[key] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  const handleBudgetRangeChange = (value: number[]) => {
    handleFilterChange('budgetRange', {
      min: value[0],
      max: value[1]
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', date: Date | undefined) => {
    const currentRange = localFilters.dateRange || { start: '', end: '' };
    const newRange = {
      ...currentRange,
      [field]: date ? format(date, 'yyyy-MM-dd') : ''
    };
    handleFilterChange('dateRange', newRange);
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.query) count++;
    if (localFilters.countries?.length) count++;
    if (localFilters.thematicPriorities?.length) count++;
    if (localFilters.subregions?.length) count++;
    if (localFilters.fundingTypes?.length) count++;
    if (localFilters.status?.length) count++;
    if (localFilters.programmePeriods?.length) count++;
    if (localFilters.budgetRange) count++;
    if (localFilters.dateRange?.start || localFilters.dateRange?.end) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredResults.toLocaleString()} of {totalResults.toLocaleString()} opportunities
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Keywords</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search opportunities, programmes, themes..."
              value={localFilters.query || ''}
              onChange={(e) => handleFilterChange('query', e.target.value || undefined)}
              className="pl-10"
            />
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Countries Filter */}
            <div className="space-y-3">
              <Label>Countries</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {AFRICAN_COUNTRIES.map((country) => (
                  <div key={country.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`country-${country.code}`}
                      checked={localFilters.countries?.includes(country.name) || false}
                      onCheckedChange={(checked) =>
                        handleArrayFilterChange('countries', country.name, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`country-${country.code}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {country.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Subregions Filter */}
            <div className="space-y-3">
              <Label>Subregions</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SUBREGIONS.map((subregion) => (
                  <div key={subregion} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subregion-${subregion}`}
                      checked={localFilters.subregions?.includes(subregion) || false}
                      onCheckedChange={(checked) =>
                        handleArrayFilterChange('subregions', subregion, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`subregion-${subregion}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {subregion}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Thematic Priorities Filter */}
            <div className="space-y-3">
              <Label>Thematic Priorities</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {THEMATIC_PRIORITIES.map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`theme-${priority}`}
                      checked={localFilters.thematicPriorities?.includes(priority) || false}
                      onCheckedChange={(checked) =>
                        handleArrayFilterChange('thematicPriorities', priority, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`theme-${priority}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding Types Filter */}
            <div className="space-y-3">
              <Label>Funding Types</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {FUNDING_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={localFilters.fundingTypes?.includes(type) || false}
                      onCheckedChange={(checked) =>
                        handleArrayFilterChange('fundingTypes', type, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <Label>Status</Label>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={localFilters.status?.includes(status) || false}
                      onCheckedChange={(checked) =>
                        handleArrayFilterChange('status', status, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`status-${status}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Programme Periods Filter */}
            <div className="space-y-3">
              <Label>Programme Periods</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PROGRAMME_PERIODS.map((period) => (
                  <div key={period} className="flex items-center space-x-2">
                    <Checkbox
                      id={`period-${period}`}
                      checked={localFilters.programmePeriods?.includes(period) || false}
                      onCheckedChange={(checked) =>
                        handleArrayFilterChange('programmePeriods', period, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`period-${period}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {period}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Range Filter */}
            <div className="space-y-3">
              <Label>Budget Range (EUR)</Label>
              <div className="space-y-2">
                <Slider
                  value={[
                    localFilters.budgetRange?.min || 0,
                    localFilters.budgetRange?.max || 10000000
                  ]}
                  onValueChange={handleBudgetRangeChange}
                  max={10000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>€{((localFilters.budgetRange?.min || 0) / 1000000).toFixed(1)}M</span>
                  <span>€{((localFilters.budgetRange?.max || 10000000) / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-3">
              <Label>Deadline Date Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !localFilters.dateRange?.start && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.dateRange?.start ? (
                          format(new Date(localFilters.dateRange.start), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={localFilters.dateRange?.start ? new Date(localFilters.dateRange.start) : undefined}
                        onSelect={(date) => handleDateRangeChange('start', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !localFilters.dateRange?.end && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.dateRange?.end ? (
                          format(new Date(localFilters.dateRange.end), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={localFilters.dateRange?.end ? new Date(localFilters.dateRange.end) : undefined}
                        onSelect={(date) => handleDateRangeChange('end', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
