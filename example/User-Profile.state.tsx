import { AppUser } from './model';

export default function Profile(props: { account: AppUser }) {
  return <div>
    Profile <br/>
    Name: {props.account.name} <br/>
    ID: {props.account.id} <br/>
  </div>
}