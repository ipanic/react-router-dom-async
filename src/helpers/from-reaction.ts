import { reaction } from 'mobx';
import { Observable } from 'rxjs';

export function fromReaction<T>(reactionCallback: () => T, fireImmediately: boolean) {
  return new Observable<T>(observer => {
    return reaction(
      reactionCallback,
      nextValue => {
        observer.next(nextValue);
      },
      { fireImmediately }
    );
  });
}
