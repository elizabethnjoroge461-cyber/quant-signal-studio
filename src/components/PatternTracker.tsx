import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tick } from '@/lib/deriv-api';
import { cn } from '@/lib/utils';

interface PatternTrackerProps {
  history: Tick[];
}

export const PatternTracker: React.FC<PatternTrackerProps> = ({ history }) => {
  const recentDigits = history.slice(0, 20);

  return (
    <Card className="w-full border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          Recent Digits Pattern
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {recentDigits.map((tick, i) => (
            <div
              key={`${tick.epoch}-${i}`}
              className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border transition-all",
                i === 0 ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30" : "bg-muted/50",
                tick.last_digit % 2 === 0 ? "border-blue-500/60" : "border-orange-500/60"
              )}
            >
              {tick.last_digit}
            </div>
          ))}
          {recentDigits.length === 0 && (
            <p className="text-xs text-muted-foreground py-2">Waiting for tick data...</p>
          )}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full border border-blue-500" /> Even
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full border border-orange-500" /> Odd
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
