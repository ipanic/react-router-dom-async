import { createContext, useContext } from 'react';
import { IRoutingContext } from './routing-context.model';

const RoutingContext = createContext<IRoutingContext | null>(null);

export function useRoutingContext() {
  const ctx = useContext(RoutingContext);
  if (ctx === null) {
    throw new Error(`useRoutingContext must be used inside AsyncRouter`);
  }
  return ctx;
}

export const RoutingProvider = RoutingContext.Provider;
