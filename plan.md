# Plan: Deriv Trading Signals & Analysis Website

Create a specialized web platform for trading on Deriv, focusing on "Matches/Differs" signals, custom signal building, and historical data analysis. The platform will serve as a tool for traders to analyze patterns and receive real-time indicators for synthetic indices.

## Scope & Non-Goals
- **Scope:**
  - Real-time Deriv WebSocket integration for ticks data.
  - "Pure Signals Builder": Interface to define logic (e.g., "last digit 5 twice").
  - Data Analysis: Visualization of digit frequency and patterns.
  - Responsive Dashboard for trading signals.
  - Simulation mode (paper trading logic).
- **Non-Goals:**
  - Real money execution (safety first; we provide signals/analysis).
  - Backend user accounts (using localStorage for saved strategies).
  - Native mobile app (web-only).

## Assumptions
- The user is familiar with Deriv's API and synthetic indices (Volatility 10, 100, etc.).
- The focus is on "Matches" signals (predicting the last digit).
- No server-side persistence required; local browser storage is sufficient for signal configurations.

## Affected Areas
- **Frontend (React):** Dashboard, Signal Builder, Analytics Charts, Live Feed.
- **Integration:** Deriv WebSocket API (Binary API).
- **State Management:** React hooks/context for live tick streams.

## Phases

### Phase 1: Foundation & API Setup
- Initialize the project structure.
- Set up a robust WebSocket client for Deriv (`wss://ws.binaryws.com/websockets/v3`).
- Create utility functions to subscribe to symbol ticks (e.g., R_100, R_10).
- **Owner:** `frontend_engineer`

### Phase 2: Data Analysis & Visualization
- Build a "Digit Stats" component showing frequency of last digits (0-9).
- Implement a "Pattern Tracker" that highlights recent sequences.
- Add Recharts or similar for historical trend visualization.
- **Owner:** `frontend_engineer`

### Phase 3: Pure Signals Builder
- Create a UI for users to define "Signal Rules" (e.g., "If digit 7 appears 3 times in 10 ticks").
- Implement the logic engine that evaluates these rules against the incoming live stream.
- Add notification/visual alerts when a signal is triggered.
- **Owner:** `frontend_engineer`

### Phase 4: UI Refinement & Polish
- Apply a "Trading Terminal" aesthetic (dark mode, high contrast).
- Add "Matches" specific UI elements (prediction targets).
- Finalize responsiveness and error handling (WebSocket reconnections).
- **Owner:** `quick_fix_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build core WebSocket integration, analytics, and signal builder.
2. quick_fix_engineer — UI polishing and final CSS tweaks.

**Per-agent instructions:**

### 1. frontend_engineer
- **Phases:** 1, 2, 3
- **Scope:** 
    - Install `recharts` and `lucide-react`.
    - Create `src/lib/deriv-api.ts` for WebSocket management.
    - Build `Dashboard.tsx` with a live tick feed.
    - Implement `DigitFrequency.tsx` and `SignalBuilder.tsx`.
    - Use `localStorage` to persist "Signal Rules".
- **Files:** `src/App.tsx`, `src/lib/deriv-api.ts`, `src/components/*`
- **Depends on:** none
- **Acceptance criteria:** Live ticks from Volatility 100 are displayed; digit frequency chart updates in real-time; custom signal rules trigger an alert.

### 2. quick_fix_engineer
- **Phases:** 4
- **Scope:** 
    - Refine the layout to look like a pro trading dashboard.
    - Ensure all colors follow a consistent dark theme (oklch values in index.css).
    - Fix any padding/alignment issues in the signal builder form.
- **Files:** `src/index.css`, `src/App.tsx`
- **Depends on:** frontend_engineer
- **Acceptance criteria:** Professional visual design; responsive on mobile; clear status indicators for WebSocket connection.
