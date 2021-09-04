import { History } from 'history';
import { action, computed, makeObservable, observable, reaction, when } from 'mobx';
import { matchPath, RouteComponentProps } from 'react-router';
import { asyncScheduler, NEVER, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, mergeMap, observeOn, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotFoundError } from '../error';
import { findMap, fromReaction } from '../helpers';
import { IAsyncRoute, IDeclaredRoute, IRedirectRoute, IUrlMatch } from '../helpers/model';
import { IRoutingContext } from '../providers';
import { AsyncSwitchProps } from './async-switch';
import { AsyncSwitchStatus, IRouterSwitchState, IRouteSwitchStore, ISwitchRouteChangeInfo } from './async-switch.model';

function isCallableObservable<TContext>(c: IDeclaredRoute<TContext>): c is IAsyncRoute<TContext> {
  return c.hasOwnProperty('callable');
}

function isRedirect<TContext>(c: IDeclaredRoute<TContext>): c is IRedirectRoute<TContext> {
  return typeof c === 'object' && c !== null && c.hasOwnProperty('to');
}

type Matched<T> = [IDeclaredRoute<T>, IUrlMatch, RouteComponentProps];

export class AsyncSwitchState<TContext> implements IRouteSwitchStore {

  ownStatus: AsyncSwitchStatus = AsyncSwitchStatus.Ready;
  pendingState: IRouterSwitchState | null = null;
  committedState: IRouterSwitchState | null = null;
  children = observable.array<IRouteSwitchStore>();

  committedContext: IRoutingContext;
  pendingContext: IRoutingContext;
  parent$ = new Subject<IRoutingContext>();

  get pending() {
    return this.ownStatus !== AsyncSwitchStatus.Ready;
  }

  get pendingEqualCommitted(): boolean {
    return this.pendingState !== null && this.committedState !== null && this.pendingState.match.path === this.committedState.match.path;
  }

  protected destroy$ = new Subject();

  constructor(protected routes: IDeclaredRoute<TContext>[],
              protected parent: IRoutingContext,
              protected history: History,
              protected context: TContext,
              protected name: string | undefined) {
    let self = this;
    makeObservable(this, {
      ownStatus: observable.ref,
      pendingState: observable.ref,
      committedState: observable.ref,

      pending: computed,
      pendingEqualCommitted: computed,

      resolveMatched: action.bound,
      resolveState: action.bound,
      waitForChildReady: action.bound,
      setReady: action.bound,
      destroy: action.bound,
      addChild: action.bound,
      removeChild: action.bound,
    });

    this.pendingContext = makeObservable({
      addChild: this.addChild,
      removeChild: this.removeChild,
      get pendingState(): IRouterSwitchState | null {
        return self.pendingState;
      },
      pending: true
    }, { pendingState: computed });

    this.committedContext = makeObservable({
      addChild: this.addChild,
      removeChild: this.removeChild,
      get pendingState(): IRouterSwitchState | null {
        return self.pendingEqualCommitted ? self.pendingState : null;
      },
      get pending() {
        return self.pending
      }
    }, { pendingState: computed });

    reaction(() => this.ownStatus, (to, from) => this.log(`State changed from ${from} to ${to}`));

    this.parent$
      .pipe(
        switchMap(parent => fromReaction(() => parent.pendingState, true)),
        map(this.resolveMatched),
        switchMap(matchers => {
          if (matchers === null) {
            return this.ownStatus !== AsyncSwitchStatus.Ready ? of(null) : NEVER;
          } else {
            this.ownStatus = AsyncSwitchStatus.Pending;
            return this.resolveState(matchers)
              .pipe(
                tap(pendingState => {
                  if (pendingState) {
                    this.pendingState = { ...pendingState, history: this.history };
                    this.ownStatus = AsyncSwitchStatus.WaitingChildRender;
                  } else {
                    this.pendingState = null;
                    this.ownStatus = AsyncSwitchStatus.Ready;
                  }
                }),
                observeOn(asyncScheduler),
                filter(it => it !== null),
                mergeMap(this.waitForChildReady)
              );
          }
        }),
        observeOn(asyncScheduler),
        catchError((_e: Error, stream$) => stream$),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: this.setReady,
        complete: () => this.log('stop watching parent.pendingState!')
      })

    this.log('$Created');
    this.parent.addChild(this);
  }

  resolveMatched(pending: RouteComponentProps | null): Matched<TContext> | null {
    if (pending === null) {
      this.log('Sync path - empty value');
      return null;
    } else {
      let matched = findMap<IDeclaredRoute<TContext>, IUrlMatch>(this.routes, route => matchPath(pending.location.pathname, route.path) || undefined);
      this.log('Sync path - ' + pending.location.pathname, matched);

      if (!matched) {
        throw new NotFoundError(pending.location.pathname + pending.location.search + pending.location.hash);
      } else {
        return [...matched, pending];
      }
    }
  }

  resolveState([route, match, { location }]: Matched<TContext>): Observable<ISwitchRouteChangeInfo | null> {
    if (this.pendingState && match.path === this.pendingState.match.path) {
      this.log('[resolve] matched with pending')
      return of({ ...this.pendingState, location, match });
    } else if (this.committedState && match.path === this.committedState.match.path) {
      if (this.committedState.location.pathname === location.pathname) {
        this.log('[resolve] matched with committed FULLY', this.committedState.location.pathname, location.pathname);
        this.committedState = { ...this.committedState, location }
        return of(null);
      } else {
        this.log('[resolve] matched with committed PARTIALLY')
        return of({ component: this.committedState.component, match, location, history: this.history });
      }
    } else if (isCallableObservable(route)) {
      this.log('[resolve] is callable observable');
      return route.callable(this.context, match).pipe(map(component => ({ component, match, location })))
    } else if (isRedirect(route)) {
      this.log('[resolve] is redirect')
      let nextStateUrl: string;
      if (typeof route.to === 'function') {
        nextStateUrl = route.to(this.context);
      } else {
        nextStateUrl = route.to;
      }
      this.history.push(nextStateUrl);
      return NEVER;
    } else {
      this.log('[resolve] else branch')
      return of({ component: route.component, match, location });
    }
  }

  waitForChildReady() {
    this.ownStatus = AsyncSwitchStatus.WaitingChildReady;
    return new Observable(observer => {
      this.log('observe for child state')
      let disposer = when(
        () => this.children.every(it => it.ownStatus === AsyncSwitchStatus.Ready),
        () => {
          this.log('observing for child state completed')
          observer.next(true);
          observer.complete();
          this.setReady();
        }
      );

      return () => disposer();
    })
  }

  setReady() {
    this.log('Set ready');
    this.ownStatus = AsyncSwitchStatus.Ready;
    if (this.pendingState) {
      this.committedState = this.pendingState;
      this.pendingState = null;
    }
  }

  addChild(child: this) {
    this.children.push(child);
  }

  removeChild(child: this) {
    this.children.remove(child);
  }

  syncProps(props: AsyncSwitchProps<TContext>) {
    this.name = props.displayName;
    this.context = props.context;
    this.routes = props.routes;
  }

  syncParent(parent: IRoutingContext) {
    this.parent$.next(parent);
  }

  destroy() {
    this.log('$Destroyed')
    this.destroy$.next(null);
    this.destroy$.complete();
    this.parent.removeChild(this);
  }

  protected log(message: string, ...args: unknown[]) {
    console.log(`${this.name}: ${message}`, ...args);
  }
}