import { Decorate } from '../../common/types';

interface RegistrationI {
  email: string;
  password: string;
  name: string;
}

interface LoginI {
  email: string;
  password: string;
}

interface QueryI {
  id: string;
}

interface UpdateI extends RegistrationI {
  id: string;
  role: string;
}

export type RegistrationReq = Decorate<{ body: RegistrationI }>;
export type LoginReq = Decorate<{ body: LoginI }>;
export type QueryReq = Decorate<{ query: QueryI }>;
export type UpdateReq = Decorate<{ body: UpdateI }>;
