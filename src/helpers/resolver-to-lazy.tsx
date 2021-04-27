import { ComponentType, lazy } from 'react';
import { Observable } from 'rxjs';

export function asyncResolverToLazy(resolver: Observable<ComponentType>) {
  return lazy(() => resolver
    .toPromise()
    .then(component => ({ default: component }))
  );
}
