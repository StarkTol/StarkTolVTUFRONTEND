import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

/**
 * Reusable error display component with red alert card
 * Shows when both real API and mock data fail to load
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Error",
  message,
  onRetry,
  retryText = "Try Again",
  className = ""
}) => {
  return (
    <Alert variant="destructive" className={`border-red-500 bg-red-50 dark:bg-red-950/20 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-red-800 dark:text-red-200">{title}</AlertTitle>
      <AlertDescription className="text-red-700 dark:text-red-300 mt-2">
        <div className="space-y-3">
          <p>{message}</p>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {retryText}
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
