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
  identifier: string,
  password: string,
): User | undefined {
  const normalizedIdentifier = identifier.trim().toLowerCase();

  return users.find(
    (user) =>
      (user.login.toLowerCase() === normalizedIdentifier ||
        user.email.toLowerCase() === normalizedIdentifier) &&
      user.password === password,
  );
}

export function findUserById(id: number): User | undefined {
  return users.find((user) => user.id === id);
}

export function findUserByLogin(login: string): User | undefined {
  const normalizedLogin = login.trim().toLowerCase();
  return users.find((user) => user.login.toLowerCase() === normalizedLogin);
}

export function findUserByEmail(email: string): User | undefined {
  const normalizedEmail = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalizedEmail);
}
