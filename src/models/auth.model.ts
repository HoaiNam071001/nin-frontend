import { User } from "./user/user.model";

export interface AuthUserPayload {
  email: string;
  password: string;
}

export interface AuthCreateUserPayload extends AuthUserPayload {
  firstName: string;
  lastName: string;
}


export interface AuthUserResponse {
  user: User;
  token: string;
}
