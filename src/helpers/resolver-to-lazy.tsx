import { ComponentType, lazy } from 'react';
import { firstValueFrom, Observable } from 'rxjs';

export function asyncResolverToLazy(resolver: Observable<ComponentType>) {
  return lazy(() => firstValueFrom(resolver)
    .then(component => ({ default: component }))
  );
}
