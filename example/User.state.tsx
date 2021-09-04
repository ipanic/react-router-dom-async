import { observer } from 'mobx-react-lite';
import { SyntheticEvent, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { AsyncSwitch, IAsyncRoute, useRouteReady } from '../src';
import { UserProfileState, UserToDoListState } from './states';
import { AppUser } from './model';

const ROUTES: IAsyncRoute<AppUser>[] = [
  {
    path: '/b/profile',
    callable: UserProfileState
  },
  {
    path: '/b/to-do-list',
    callable: UserToDoListState
  }
]

function UserSpace(props: { account: AppUser }) {
  let h = useHistory();
  let logout = useCallback((ev: SyntheticEvent) => {
    ev.preventDefault();
    h.push('/a/login');
  }, [h]);

  useRouteReady(() => console.error('user state ready!'))

  return <div className="User-space">
    <div className="User-space__header">
      <Link to="/b/profile">Profile</Link>
      <Link to="/b/to-do-list">List</Link>
      <button onClick={logout}>Logout</button>
    </div>
    <div className="User-space__router-outlet">
      <AsyncSwitch routes={ROUTES} context={props.account} displayName={'User'}/>
    </div>
  </div>
}

export default observer(UserSpace);