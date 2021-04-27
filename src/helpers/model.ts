import { ComponentType, CSSProperties } from 'react';
import { matchPath, RouteComponentProps } from 'react-router';
import { Observable } from 'rxjs';
import { IRouteSwitchStore } from '../async-switch/model';

export type IUrlMatch = NonNullable<ReturnType<typeof matchPath>>;

export type ICallableObservableComponent<TContext> = (injector: TContext, match: IUrlMatch) => Observable<ComponentType<{ style?: CSSProperties }>>;

export interface IAsyncRoute<TContext> {
  callable: ICallableObservableComponent<TContext>;
  path: string | string[];
}

export interface ISyncRoute {
  component: ComponentType<{ style?: CSSProperties }>;
  path: string | string[];
}

export interface IRedirectRoute<TContext> {
  to: string | ((ctx: TContext) => string) | (() => string);
  path: string | string[];
}

export type IDeclaredRoute<TContext> = IAsyncRoute<TContext> | ISyncRoute | IRedirectRoute<TContext>;

export interface ISharedRouterStore {

  readonly pendingState: RouteComponentProps | null;

  addChild(child: IRouteSwitchStore): void;

  removeChild(child: IRouteSwitchStore): void;
}