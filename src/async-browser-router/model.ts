import { RouteComponentProps } from 'react-router';
import { ISharedRouterStore } from '../helpers/model';

export interface IAsyncBrowserRouterStore extends ISharedRouterStore {

  committedState: RouteComponentProps | null;
}