import { action, computed, makeObservable, observable } from 'mobx';
import { RouteComponentProps } from 'react-router';
import { identity, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AsyncSwitchStatus, IRouteSwitchStore } from '../async-switch/async-switch.model';
import { fromReaction } from '../helpers';
import { IAsyncBrowserRouterStore } from './async-browser-router.model';

export class AsyncBrowserRouterStore implements IAsyncBrowserRouterStore {

  committedState: RouteComponentProps | null;
  pendingState: RouteComponentProps | null;

  get pending(): boolean {
    return this.children.some(it => it.ownStatus !== AsyncSwitchStatus.Ready);
  }

  protected children = observable.array<IRouteSwitchStore>([], { deep: false, proxy: false });
  protected destroy$ = new Subject();

  constructor(state: RouteComponentProps) {
    this.pendingState = this.committedState = state;

    makeObservable(this, {
      committedState: observable.ref,
      pendingState: observable.ref,
      pending: computed,

      addChild: action,
      removeChild: action,
      changeState: action,
      commitLocation: action,
    });

    fromReaction(() => !this.pending, false)
      .pipe(
        filter(identity),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.commitLocation());
  }

  addChild(child: IRouteSwitchStore) {
    this.children.unshift(child);
  }

  removeChild(switcher: IRouteSwitchStore) {
    this.children.remove(switcher);
  }

  changeState(state: RouteComponentProps) {
    this.pendingState = state;
  }

  commitLocation() {
    if (this.pendingState) {
      this.committedState = this.pendingState;
      this.pendingState = null;
    }
  }

  destroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}