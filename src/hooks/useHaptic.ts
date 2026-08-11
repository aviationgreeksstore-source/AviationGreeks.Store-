'use client';

import { useCallback } from 'react';

type HapticProfile = 'light' | 'heavy' | 'warning';

export function useHaptic() {
  const triggerHaptic = useCallback((profile: HapticProfile) => {
    // Safety check: ensure navigator and navigator.vibrate are available
    if (typeof navigator === 'undefined' || !navigator.vibrate) {
      return;
    }

    switch (profile) {
      case 'light':
        // A crisp, 10ms micro-pulse (Toggle Switch)
        navigator.vibrate(10);
        break;
      case 'heavy':
        // A solid, multi-stage thud (Master Arm / Gear Lever)
        navigator.vibrate([20, 30, 20]);
        break;
      case 'warning':
        // A rapid double-buzz (Master Caution)
        navigator.vibrate([40, 60, 40]);
        break;
      default:
        break;
    }
  }, []);

  return { triggerHaptic };
}
