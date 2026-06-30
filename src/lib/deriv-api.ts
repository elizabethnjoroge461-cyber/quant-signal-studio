import { useEffect, useRef, useState, useCallback } from 'react';

const DERIV_WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';

export interface Tick {
  symbol: string;
  quote: number;
  epoch: number;
  pip_size: number;
  last_digit: number;
}

export interface DerivMessage {
  msg_type: string;
  tick?: {
    symbol: string;
    quote: number;
    epoch: number;
    pip_size: number;
  };
  error?: {
    message: string;
    code: string;
  };
}

export const useDerivTicks = (symbol: string) => {
  const [lastTick, setLastTick] = useState<Tick | null>(null);
  const [history, setHistory] = useState<Tick[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(DERIV_WS_URL);

    ws.current.onopen = () => {
      setIsConnected(true);
      setError(null);
      ws.current?.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
    };

    ws.current.onmessage = (event) => {
      const data: DerivMessage = JSON.parse(event.data);

      if (data.error) {
        setError(data.error.message);
        return;
      }

      if (data.msg_type === 'tick' && data.tick) {
        const quoteStr = data.tick.quote.toFixed(data.tick.pip_size);
        const lastDigit = parseInt(quoteStr.slice(-1));
        
        const newTick: Tick = {
          symbol: data.tick.symbol,
          quote: data.tick.quote,
          epoch: data.tick.epoch,
          pip_size: data.tick.pip_size,
          last_digit: lastDigit,
        };

        setLastTick(newTick);
        setHistory((prev) => [newTick, ...prev].slice(0, 100));
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      // Attempt reconnection after 3 seconds
      setTimeout(connect, 3000);
    };

    ws.current.onerror = () => {
      setError('WebSocket connection error');
    };
  }, [symbol]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return { lastTick, history, isConnected, error };
};
