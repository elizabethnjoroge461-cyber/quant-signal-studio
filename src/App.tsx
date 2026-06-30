import React, { useState } from 'react';
import { useDerivTicks } from '@/lib/deriv-api';
import { DigitFrequency } from '@/components/DigitFrequency';
import { PatternTracker } from '@/components/PatternTracker';
import { SignalBuilder } from '@/components/SignalBuilder';
import { Toaster } from '@/components/ui/sonner';
import { 
  Activity, 
  Settings, 
  BarChart3, 
  Zap, 
  Wifi, 
  WifiOff,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const SYMBOLS = [
  { value: 'R_10', label: 'Volatility 10 Index' },
  { value: 'R_25', label: 'Volatility 25 Index' },
  { value: 'R_50', label: 'Volatility 50 Index' },
  { value: 'R_75', label: 'Volatility 75 Index' },
  { value: 'R_100', label: 'Volatility 100 Index' },
  { value: '1HZ10V', label: 'Volatility 10 (1s) Index' },
  { value: '1HZ100V', label: 'Volatility 100 (1s) Index' },
];

function App() {
  const [symbol, setSymbol] = useState('R_100');
  const { lastTick, history, isConnected, error } = useDerivTicks(symbol);

  const prevTick = history[1];
  const isUp = lastTick && prevTick ? lastTick.quote > prevTick.quote : null;

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, oklch(0.25 0.02 260 / 0.3) 0%, transparent 50%)' }}>
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-base sm:text-lg tracking-tight">PureSignals <span className="text-primary font-black">DERIV</span></h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className={cn(
              "flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-1 rounded-full border",
              isConnected ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"
            )}>
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span className="hidden sm:inline">{isConnected ? 'LIVE' : 'OFFLINE'}</span>
              <span className="sm:hidden">{isConnected ? 'LIVE' : 'OFF'}</span>
            </div>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-[130px] sm:w-[180px] h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="Select Market" />
              </SelectTrigger>
              <SelectContent>
                {SYMBOLS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Stats Strip */}
        <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-6 text-xs text-muted-foreground overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">Ticks: <span className="text-foreground tabular-nums">{history.length}</span></span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-medium">Symbol: <span className="text-foreground">{symbol}</span></span>
          </div>
          {lastTick && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-medium">Last: <span className="text-foreground tabular-nums">{lastTick.quote.toFixed(lastTick.pip_size)}</span></span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column: Live Feed & Ticker */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Live Quote</span>
                  {lastTick && (
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-bold",
                      isUp ? "text-green-500" : "text-red-500"
                    )}>
                      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {isUp ? 'BULL' : 'BEAR'}
                    </div>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter tabular-nums">
                    {lastTick ? lastTick.quote.toFixed(lastTick.pip_size) : '0.00'}
                  </span>
                  <span className="text-sm text-muted-foreground">USD</span>
                </div>

                <div className="mt-8 flex justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all" />
                    <div className="relative w-24 h-24 rounded-full border-4 border-primary flex flex-col items-center justify-center bg-card shadow-2xl">
                      <span className="text-xs font-bold text-muted-foreground">LAST DIGIT</span>
                      <span className="text-4xl font-black text-primary animate-in zoom-in duration-300">
                        {lastTick ? lastTick.last_digit : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PatternTracker history={history} />
          </div>

          {/* Middle/Right Column: Analytics & Tools */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Analysis</h2>
                </div>
                <DigitFrequency history={history} />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Signals</h2>
                </div>
                <SignalBuilder history={history} />
              </div>
            </div>

            {/* Simulation/Instructions Placeholder */}
            <Card className="bg-muted/20 border-dashed border-border/50">
              <CardContent className="p-4 sm:p-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="h-4 w-4" />
                  <h3 className="font-semibold text-foreground">Matches Signals Guide</h3>
                </div>
                <ul className="space-y-2 list-disc pl-4">
                  <li>Select a Volatility Index from the header dropdown.</li>
                  <li>Monitor the <strong>Digit Frequency</strong> chart to identify "hot" or "cold" digits.</li>
                  <li>Use the <strong>Signal Builder</strong> to create alerts based on digit patterns (e.g., if digit 5 appears 3 times in 10 ticks).</li>
                  <li>This platform provides visual and audio-visual cues only. No real funds are traded here.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/60 py-4 sm:py-6 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2024 PureSignals DERIV. Data via Deriv API.</p>
          <p className="text-[10px] opacity-70">⚠ Trading involves risk. Signals are for analysis only.</p>
        </div>
      </footer>
      
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
