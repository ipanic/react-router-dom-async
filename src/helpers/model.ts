import { ComponentType, CSSProperties } from 'react';
import { matchPath } from 'react-router';
import { Observable } from 'rxjs';

export type IUrlMatch = NonNullable<ReturnType<typeof matchPath>>;

export type ICallableObservableComponent<TContext> = (injector: TContext, match: IUrlMatch) => Observable<ComponentType<{ style?: CSSProperties }>>;

export interface IAsyncRoute<TContext> {
  callable: ICallableObservableComponent<TContext>;
  path: string | string[];
  exact?: boolean;
}

export interface ISyncRoute {
  component: ComponentType<{ style?: CSSProperties }>;
  path: string | string[];
  exact?: boolean;
}

export interface IRedirectRoute<TContext> {
  to: string | ((ctx: TContext) => string) | (() => string);
  path: string | string[];
}

export type IDeclaredRoute<TContext> = IAsyncRoute<TContext> | ISyncRoute | IRedirectRoute<TContext>;
