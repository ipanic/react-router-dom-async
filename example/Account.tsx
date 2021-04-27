import { Link } from 'react-router-dom';

import { LoginState, RegistrationState } from './states';
import { AsyncSwitch, IDeclaredRoute } from '../src';

const ROUTES: IDeclaredRoute<void>[] = [
  {
    path: '/a/login',
    callable: LoginState
  },
  {
    path: '/a/registration',
    callable: RegistrationState
  },
  {
    path: '/a*',
    to: '/a/login'
  }
]

export default function Account() {
  return <div className="A full-screen">
    <aside className="A__sidebar">
      <Link to="/a/login">Login</Link>
      <Link to="/a/registration">Registration</Link>
    </aside>
    <div className="A__route-outlet">
      <AsyncSwitch context={undefined} routes={ROUTES} displayName="Account"/>
    </div>
  </div>
}