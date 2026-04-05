import usersJson from '../data/users.json';

export interface User {
  id: number;
  login: string;
  password: string;
  name: string;
  last_name: string;
  avatar: string;
  phone: string;
  email: string;
}

export let CURRENT_USER_ID = 1;
export let users: User[] = usersJson as User[];

export function setCurrentUserId(id: number) {
  CURRENT_USER_ID = id;
}

export function addUser(user: User) {
  users.push(user);
}

export function findUserByCredentials(
  login: string,
  password: string,
): User | undefined {
  return users.find(
    (user) => user.login === login && user.password === password,
  );
}
