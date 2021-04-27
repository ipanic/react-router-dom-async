import { of, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { asyncResolver } from '../src';
import { AppUser } from './model';
import { UserToDoListProps } from './User-ToDoList.state';

export const AccountState = () => asyncResolver(
  () => import('./Account')
);

export const LoginState = () => asyncResolver(
  () => import('./Account-Login.state')
);

export const RegistrationState = () => asyncResolver(
  () => import('./Account-Registration.state')
);

export const UserSpaceState = () => asyncResolver(
  () => import('./User.state'),
  timer(3500)
    .pipe(mapTo({
      account: {
        id: 'user-id',
        name: 'Admin'
      }
    }))
);

export const UserProfileState = (ctx: AppUser) => asyncResolver(
  () => import('./User-Profile.state'),
  of({ account: ctx })
);

export const UserToDoListState = () => asyncResolver(
  () => import('./User-ToDoList.state'),
  timer((Math.random()) * 5000)
    .pipe(mapTo<unknown, UserToDoListProps>(({
      todoList: [
        { caption: 'Drink water', done: false, id: 1 },
        { caption: 'Wake up at 7 am', done: false, id: 2 },
        { caption: 'Clean dishes', done: true, id: 3 },
        { caption: 'Twenty pull-ups ', done: false, id: 4 },
      ]
    })))
);
