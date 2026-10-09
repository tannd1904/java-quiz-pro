import { useState, useEffect, useRef } from 'react';

interface UseQuizTimerProps {
  totalSeconds: number;
  initialRemainingSeconds?: number;
  isRunning: boolean;
  onTimeout: () => void;
}

interface UseQuizTimerResult {
  remainingSeconds: number;
  formattedTime: string;
  progressPercent: number;
  isWarning: boolean;
  isCritical: boolean;
}

export function useQuizTimer({
  totalSeconds,
  initialRemainingSeconds,
  isRunning,
  onTimeout,
}: UseQuizTimerProps): UseQuizTimerResult {
  const startRemaining =
    typeof initialRemainingSeconds === 'number' && initialRemainingSeconds > 0
      ? initialRemainingSeconds
      : totalSeconds;

  const [remainingSeconds, setRemainingSeconds] = useState(startRemaining);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const endTimeRef = useRef<number>(0);
  const hasTimedOutRef = useRef(false);

  useEffect(() => {
    const initRemaining =
      typeof initialRemainingSeconds === 'number' && initialRemainingSeconds > 0
        ? initialRemainingSeconds
        : totalSeconds;
    setRemainingSeconds(initRemaining);
    hasTimedOutRef.current = false;
    if (isRunning && initRemaining > 0) {
      endTimeRef.current = Date.now() + initRemaining * 1000;
    }
  }, [totalSeconds, initialRemainingSeconds, isRunning]);

  useEffect(() => {
    if (!isRunning || totalSeconds <= 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
      setRemainingSeconds(diff);

      if (diff <= 0 && !hasTimedOutRef.current) {
        hasTimedOutRef.current = true;
        clearInterval(interval);
        onTimeoutRef.current();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
  const isWarning = remainingSeconds <= 60 && remainingSeconds > 30;
  const isCritical = remainingSeconds <= 30;

  return {
    remainingSeconds,
    formattedTime,
    progressPercent,
    isWarning,
    isCritical,
  };
}
