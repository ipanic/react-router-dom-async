import { createContext, useContext } from 'react';
import { IllegalSwitchContextUsage } from '../error';

export interface IAsyncSwitchContext {
  pending: boolean;
}

const AsyncSwitchContext = createContext<IAsyncSwitchContext | null>(null);

export function useAsyncSwitchContext() {
  let ctx = useContext(AsyncSwitchContext);
  if (ctx === null) {
    throw new IllegalSwitchContextUsage();
  }
  return ctx;
}

export const AsyncSwitchProvider = AsyncSwitchContext.Provider;