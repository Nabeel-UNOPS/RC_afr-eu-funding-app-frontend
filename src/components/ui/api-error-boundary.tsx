"use client";

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ApiErrorBoundaryProps {
  error?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ApiErrorBoundary({ 
  error = "Failed to load funding opportunities", 
  onRetry, 
  showRetry = true 
}: ApiErrorBoundaryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription className="mt-2">
          {error}. Please check your internet connection and try again.
        </AlertDescription>
      </Alert>
      
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="mt-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
      
      <p className="text-sm text-muted-foreground mt-4 text-center">
        If the problem persists, please contact the system administrator.
      </p>
    </div>
  );
}
