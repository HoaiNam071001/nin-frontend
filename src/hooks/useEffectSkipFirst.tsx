import { useEffect, useRef } from "react";

function useEffectAfterMount(effect: () => void, deps: readonly unknown[]) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    effect();
  }, deps);
}

export default useEffectAfterMount;
