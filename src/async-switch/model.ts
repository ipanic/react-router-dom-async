import { ComponentType, CSSProperties } from 'react';
import { RouteComponentProps } from 'react-router';
import { ISharedRouterStore } from '../helpers/model';

export interface ISwitchRouteChangeInfo extends Omit<RouteComponentProps, 'history' | 'staticContext'> {
  component: ComponentType;
}

export enum AsyncSwitchStatus {
  Pending = 'Pending',
  WaitingChildRender = 'WaitingChildRender',
  WaitingChildReady = 'WaitingChildReady',
  Ready = 'Ready'
}

export interface IRouteSwitchStore extends ISharedRouterStore {

  committedState: IRouterSwitchState | null;

  readonly ownState: AsyncSwitchStatus;
}

export interface IRouterSwitchState extends Omit<RouteComponentProps, 'staticContext'> {
  component: ComponentType<{ style?: CSSProperties }>;
}