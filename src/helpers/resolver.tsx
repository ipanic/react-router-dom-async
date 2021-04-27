import { ComponentType, PropsWithChildren } from 'react';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export function asyncResolver(factory: () => Promise<{ default: ComponentType }>): Observable<ComponentType>;
export function asyncResolver<TProps>(factory: () => Promise<{ default: ComponentType<TProps> }>, dataSource: Observable<TProps>): Observable<ComponentType>;

export function asyncResolver<TProps>(
  component: () => Promise<{ default: ComponentType<TProps> }>,
  props?: Observable<TProps>
): Observable<ComponentType> {
  return forkJoin([props ?? of({} as TProps), component()])
    .pipe(
      map(([data, { default: Component }]) => {
        return (props: PropsWithChildren<{}>) => <Component {...data} {...props}/>;
      })
    )
}