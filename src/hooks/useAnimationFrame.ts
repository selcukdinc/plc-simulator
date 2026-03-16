import { useEffect, useRef } from 'react';

export function useAnimationFrame(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    let frameId: number;
    const animate = () => {
      callbackRef.current();
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);
}
