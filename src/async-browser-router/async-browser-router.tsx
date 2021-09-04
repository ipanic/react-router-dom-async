import { observer } from 'mobx-react-lite';
import { PropsWithChildren, useEffect, useState } from 'react';
import { __RouterContext, RouteComponentProps } from 'react-router';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';
import { AsyncBrowserRouterStore } from './async-browser-router.store';
import { RoutingProvider } from '../providers';

const AsyncBrowserRouterComponent = observer((props: PropsWithChildren<RouteComponentProps>) => {
  let { children, ...routeProps } = props;
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
    <__RouterContext.Consumer>{ctx =>
      <AsyncBrowserRouterComponent {...ctx} children={children}/>
    }</__RouterContext.Consumer>
  </BrowserRouter>
}