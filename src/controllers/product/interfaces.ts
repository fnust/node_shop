import { type } from 'os';
import { Decorate } from '../../common/types';

interface CreateI {
  name: string;
  producer: string;
  type: string;
  price: number;
  description: string;
}

interface QueryI {
  id: string;
}

interface UpdateI extends CreateI {
  id: string;
  role: string;
}

export type CreateReq = Decorate<{ body: CreateI }>;
export type QueryReq = Decorate<{ query: QueryI }>;
export type UpdateReq = Decorate<{ body: UpdateI }>;
