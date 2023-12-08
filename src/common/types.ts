import { Request } from 'express';

export interface authPayload {
  id: string;
  role: string;
}

export type AuthRequest = Request & { credentials: authPayload };
export type Decorate<T> = AuthRequest & Readonly<T>;
