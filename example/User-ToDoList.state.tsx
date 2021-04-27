import { TodoList } from './model';

export interface UserToDoListProps {
  todoList: TodoList;
}

export default function UserToDoList(props: UserToDoListProps) {
  return <div className="User-todo-list">
    <div>Total: {props.todoList.length}</div>
    {props.todoList.map(it => <label key={it.id}>
      <input type="checkbox" defaultChecked={it.done}/>
      <span>{it.caption}</span>
    </label>)}
  </div>
}