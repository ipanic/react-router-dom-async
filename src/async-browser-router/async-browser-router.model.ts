import { RouteComponentProps } from 'react-router';
import { IRoutingContext } from '../providers';

export interface IAsyncBrowserRouterStore extends IRoutingContext {

  committedState: RouteComponentProps | null;
}