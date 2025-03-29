export function throttleFunc<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall: number = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall < wait && lastCall > 0) {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          func(...args);
          timeoutId = null;
        }, wait - (now - lastCall));
      }
      return;
    }

    lastCall = now;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    func(...args);
  };
}
