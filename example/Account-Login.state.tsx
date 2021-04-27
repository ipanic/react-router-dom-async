import { SyntheticEvent, useCallback } from 'react';
import { useHistory } from 'react-router';

export default function Login() {
  let h = useHistory();
  let submit = useCallback((ev: SyntheticEvent) => {
    ev.preventDefault();
    h.push("/b/to-do-list");
  }, [h]);

  return <form onSubmit={submit} method="GET">
    <input placeholder="Login"/>
    <button>Login</button>
  </form>;
}
