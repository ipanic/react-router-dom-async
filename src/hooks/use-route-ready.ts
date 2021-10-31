import { useEffect } from 'react';
import { useRoutingContext } from '../providers';

export function useRouteReady(callback: () => unknown) {
  let routing = useRoutingContext();

  useEffect(() => {
    !routing.pending && callback();
  }, [routing.pending, callback]);
}
