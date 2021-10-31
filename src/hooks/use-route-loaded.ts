import { useState } from 'react';
import { useRouteReady } from './use-route-ready';

export function useRouteLoaded(cb: () => unknown) {
  let [wasCalled, setWasCalled] = useState(false);

  useRouteReady(() => {
    if (!wasCalled) {
      setWasCalled(true);
      cb();
    }
  })
}