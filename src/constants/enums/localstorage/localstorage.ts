import { LayoutStorageKey } from "./layout";
import { UserStorageKey } from "./user";

export const StorageKey = {
  ...UserStorageKey,
  ...LayoutStorageKey,
} as const;
