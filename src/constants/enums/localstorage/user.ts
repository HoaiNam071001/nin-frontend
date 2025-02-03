import { User } from "@/models";

export enum UserStorageKey {
  AUTH_TOKEN = "user:authToken",
  ACTIVE_ROLE = "user:activeRole",
}

export class UserLocalStorage {
  static getByUser({ key, user }: { user: User, key: UserStorageKey }) {
    return `${key}:${user.id}`;
  }
}
