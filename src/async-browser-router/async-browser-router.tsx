import { observer } from 'mobx-react-lite';
import { PropsWithChildren, useEffect, useState } from 'react';
import { __RouterContext, RouteComponentProps } from 'react-router';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';
import { AsyncBrowserRouterStore } from './async-browser-router.store';
import { RouteParentProvider } from './router-context';

const AsyncBrowserRouter = observer((props: PropsWithChildren<RouteComponentProps>) => {
  let { children, ...routeProps } = props;
  let [state] = useState(() => new AsyncBrowserRouterStore(routeProps));

  useEffect(() => () => state.destroy(), []);
  useEffect(() => {
    state.changeState(routeProps);
  }, [routeProps.location.pathname]);

  return <RouteParentProvider value={state}>
    {state.committedState && <__RouterContext.Provider value={state.committedState}>
      {props.children}
    </__RouterContext.Provider>}
  </RouteParentProvider>
});

export default function AsyncBrowserRouterWrapper(props: PropsWithChildren<BrowserRouterProps>) {
  let { children, ...routerProps } = props;
  return <BrowserRouter {...routerProps}>
    <__RouterContext.Consumer>{ctx =>
      <AsyncBrowserRouter {...ctx} children={children}/>
    }</__RouterContext.Consumer>
  </BrowserRouter>
}