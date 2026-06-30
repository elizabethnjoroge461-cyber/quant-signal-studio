import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Bell, BellRing } from 'lucide-react';
import { Tick } from '@/lib/deriv-api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface SignalRule {
  id: string;
  digit: number;
  count: number;
  lookback: number;
  active: boolean;
}

interface SignalBuilderProps {
  history: Tick[];
}

export const SignalBuilder: React.FC<SignalBuilderProps> = ({ history }) => {
  const [rules, setRules] = useState<SignalRule[]>(() => {
    const saved = localStorage.getItem('deriv_signal_rules');
    return saved ? JSON.parse(saved) : [];
  });

  const [newRule, setNewRule] = useState({
    digit: 0,
    count: 3,
    lookback: 10,
  });

  useEffect(() => {
    localStorage.setItem('deriv_signal_rules', JSON.stringify(rules));
  }, [rules]);

  // Logic engine: evaluate rules against history
  useEffect(() => {
    if (history.length === 0) return;

    rules.forEach((rule) => {
      if (!rule.active) return;

      const recentTicks = history.slice(0, rule.lookback);
      const matches = recentTicks.filter((t) => t.last_digit === rule.digit).length;

      if (matches >= rule.count && history[0].last_digit === rule.digit) {
        toast(`Signal Triggered! Digit ${rule.digit} appeared ${matches} times.`, {
          icon: <BellRing className="h-4 w-4 text-primary" />,
          description: `Pattern matched: ${rule.count} occurrences in ${rule.lookback} ticks.`,
        });
      }
    });
  }, [history, rules]);

  const addRule = () => {
    const rule: SignalRule = {
      id: Math.random().toString(36).substr(2, 9),
      ...newRule,
      active: true,
    };
    setRules([...rules, rule]);
    toast.success('Signal rule added');
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const toggleRule = (id: string) => {
    setRules(rules.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bell className="h-4 w-4" /> Signal Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 p-3 border border-border/60 rounded-lg bg-muted/20">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase">Digit</Label>
              <Input 
                type="number" 
                min="0" max="9" 
                value={newRule.digit}
                onChange={(e) => setNewRule({ ...newRule, digit: parseInt(e.target.value) || 0 })}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase">Count</Label>
              <Input 
                type="number" 
                min="1"
                value={newRule.count}
                onChange={(e) => setNewRule({ ...newRule, count: parseInt(e.target.value) || 1 })}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase">Ticks</Label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  min="1"
                  value={newRule.lookback}
                  onChange={(e) => setNewRule({ ...newRule, lookback: parseInt(e.target.value) || 1 })}
                  className="h-8"
                />
                <Button size="icon" className="h-8 w-8 shrink-0" onClick={addRule}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-2.5 border border-border/60 rounded-md text-sm bg-muted/10 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    rule.active ? "bg-green-400 animate-pulse shadow-sm shadow-green-400/50" : "bg-muted-foreground/50"
                  )} />
                  <span className="font-medium">Digit {rule.digit} <span className="text-muted-foreground">({rule.count}× in {rule.lookback})</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => toggleRule(rule.id)}
                  >
                    <Bell className={cn("h-3 w-3", !rule.active && "text-muted-foreground")} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeRule(rule.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {rules.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-4">No signal rules defined.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
