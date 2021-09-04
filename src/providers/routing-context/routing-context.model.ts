import { RouteComponentProps } from 'react-router';
import { IRouteSwitchStore } from '../../async-switch/async-switch.model';

export interface IRoutingContext {
  readonly pendingState: RouteComponentProps | null;

  readonly pending: boolean;

  addChild(child: IRouteSwitchStore): void;

  removeChild(child: IRouteSwitchStore): void;
}