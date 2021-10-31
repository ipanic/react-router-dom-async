import { observer } from 'mobx-react-lite';
import { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { __RouterContext } from 'react-router';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';
import { RoutingProvider } from '../providers';
import { AsyncBrowserRouterStore } from './async-browser-router.store';

const AsyncBrowserRouterComponent = observer((props: PropsWithChildren<{}>) => {
  let routeProps = useContext(__RouterContext);
  let [state] = useState(() => new AsyncBrowserRouterStore(routeProps));

  useEffect(() => () => state.destroy(), []);
  useEffect(() => state.changeState(routeProps), [routeProps.location.pathname, routeProps.location.search]);

  return <RoutingProvider value={state}>
    {state.committedState && <__RouterContext.Provider value={state.committedState}>
      {props.children}
    </__RouterContext.Provider>}
  </RoutingProvider>
});

export function AsyncBrowserRouter(props: PropsWithChildren<BrowserRouterProps>) {
  let { children, ...routerProps } = props;
  return <BrowserRouter {...routerProps}>
    <AsyncBrowserRouterComponent children={children}/>
  </BrowserRouter>
}