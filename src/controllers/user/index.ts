import { Request, Response } from 'express';
import { LoginReq, QueryReq, RegistrationReq, UpdateReq } from './interfaces';
import { User } from '../../model/entities/User';
import { check, hash } from '../../helpers/hashing';
import { userRepo } from '../../model/repositories';
import { generateToken } from '../../helpers/authorisation';
import { AuthRequest } from '../../common/types';
import { validate } from 'uuid';

class UserController {
  static async registration(req: RegistrationReq, res: Response) {
    try {
      const { name, email, password } = req.body;

      let user: User | null = new User();
      user.name = name;
      user.email = email;
      user.password = await hash(password);

      user = await userRepo.create(user);

      if (!user) {
        res.status(500).send('Something broke!');
        return;
      }

      const token = generateToken(user.id, 'customer');

      res
        .status(200)
        .send({ name: user.name, email: user.email, token: token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async login(req: LoginReq, res: Response) {
    try {
      const { email, password } = req.body;

      const user: User | null = await userRepo.findOne({}, { email: email });

      if (!user) {
        res.status(404).send('User not found!');
        return;
      }

      if (!(await check(user.password, password))) {
        res.status(401).send('Invalid password!');
        return;
      }

      const token = generateToken(user.id, user.role);

      res
        .status(200)
        .send({ name: user.name, email: user.email, token: token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const users = await userRepo.find({ role: 'customer' });
      res.status(200).send(users);
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async getInfo(req: AuthRequest, res: Response) {
    try {
      const id = req.credentials.id;

      if (!id) {
        res.status(500).send('Something broke!');
        return;
      }

      const user = await userRepo.findOne({}, { id: id });

      if (!user) {
        res.status(404).send('User not found!');
        return;
      }

      res.status(200).send({
        id: id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async get(req: QueryReq, res: Response) {
    try {
      const id = req.query.id;

      if (!id || !validate(id)) {
        res.status(500).send('Query is empry or invalid!');
        return;
      }

      const user = await userRepo.findOne({}, { id: id });

      if (!user) {
        res.status(404).send('User not found!');
        return;
      }

      res.status(200).send({
        id: id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async delete(req: QueryReq, res: Response) {
    try {
      const id = req.query.id;

      if (!id || !validate(id)) {
        res.status(500).send('Query is empry or invalid!');
        return;
      }

      if (await userRepo.deleteById(id)) {
        return res.status(200).send('Success!');
      } else {
        return res.status(500).send('Something broke!');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async update(req: UpdateReq, res: Response) {
    try {
      const { id, name, email, role } = req.body;

      if (!validate(id)) {
        res.status(500).send('ID is invalid!');
        return;
      }

      let user = await userRepo.findOne({}, { id: id });

      if (!user) {
        res.status(404).send('User not found!');
        return;
      }

      user.name = name;
      user.email = email;
      user.role = role;

      user = await userRepo.create(user);

      if (!user) {
        res.status(500).send('Something broke!');
        return;
      }

      res.status(200).send({ id, name, email, role });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }
}

export default UserController;
