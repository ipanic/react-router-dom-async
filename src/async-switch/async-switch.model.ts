import { ComponentType, CSSProperties } from 'react';
import { RouteComponentProps } from 'react-router';
import { IRoutingContext } from '../providers';

export enum AsyncSwitchStatus {
  Pending = 'Pending',
  WaitingChildRender = 'WaitingChildRender',
  WaitingChildReady = 'WaitingChildReady',
  Ready = 'Ready'
}

export interface ISwitchRouteChangeInfo extends Omit<RouteComponentProps, 'history' | 'staticContext'> {
  component: ComponentType;
}

export interface IRouterSwitchState extends Omit<RouteComponentProps, 'staticContext'> {
  component: ComponentType<{ style?: CSSProperties }>;
}

export interface IRouteSwitchStore extends IRoutingContext {

  committedState: IRouterSwitchState | null;

  readonly ownStatus: AsyncSwitchStatus;
}
