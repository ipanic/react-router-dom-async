import { render } from 'react-dom'
import { AsyncBrowserRouter, AsyncSwitch, IDeclaredRoute } from '../src';
import { AccountState, UserSpaceState } from './states';

const ROUTES: IDeclaredRoute<void>[] = [
  {
    path: '/a',
    callable: AccountState
  },
  {
    path: '/b',
    callable: UserSpaceState
  },
  {
    path: '*',
    to: '/a'
  }
]

function App() {
  return <AsyncBrowserRouter>
    <AsyncSwitch routes={ROUTES} context={undefined} displayName="Root"/>
  </AsyncBrowserRouter>;
}

render(<App/>, document.querySelector('#root'));
