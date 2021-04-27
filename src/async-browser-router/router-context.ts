import { createContext, useContext } from 'react';
import { ISharedRouterStore } from '../helpers/model';

const RouteParent = createContext<ISharedRouterStore | null>(null);

export function useRouteParent() {
  const ctx = useContext(RouteParent);
  if (ctx === null) {
    throw new Error(`useRouteParent must be used inside AsyncRouter`)
  }
  return ctx;
}

export const RouteParentProvider = RouteParent.Provider;
