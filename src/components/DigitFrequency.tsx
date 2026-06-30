import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tick } from '@/lib/deriv-api';

interface DigitFrequencyProps {
  history: Tick[];
}

export const DigitFrequency: React.FC<DigitFrequencyProps> = ({ history }) => {
  const data = useMemo(() => {
    const counts = Array(10).fill(0);
    history.forEach((tick) => {
      counts[tick.last_digit]++;
    });

    return counts.map((count, digit) => ({
      digit: digit.toString(),
      count,
      percentage: history.length > 0 ? ((count / history.length) * 100).toFixed(1) : 0,
    }));
  }, [history]);

  return (
    <Card className="w-full border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          Last Digit Frequency <span className="text-muted-foreground font-normal">(Last 100 Ticks)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] sm:h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="digit" stroke="#666666" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border/60 rounded-lg p-2.5 shadow-lg text-xs">
                        <p className="font-bold text-sm">Digit {payload[0].payload.digit}</p>
                        <p className="text-muted-foreground">Count: {payload[0].value}</p>
                        <p className="text-muted-foreground">Freq: {payload[0].payload.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={parseInt(entry.percentage as string) > 15 ? 'hsl(var(--chart-1))' : 'hsl(var(--muted-foreground) / 0.4)'} 
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
