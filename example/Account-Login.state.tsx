import { SyntheticEvent, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom'

export default function Login() {
  let h = useHistory();
  let l = useLocation();
  let submit = useCallback((ev: SyntheticEvent) => {
    ev.preventDefault();
    h.push("/b/to-do-list");
  }, [h]);

  return <form onSubmit={submit} method="GET">
    <input placeholder="Login"/>
    <button>Login</button>
    <Link to="?toggle" >Toggle search</Link>

    <br/>
    Pathname: {l.pathname}
    Search: {l.search}
  </form>;
}
