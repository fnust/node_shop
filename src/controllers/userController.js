import pool from '../dbconfig.js';
import { v4 as uuidv4, validate } from 'uuid';
import { check, hash } from '../helpers/hashing.js';
import { generateToken } from '../helpers/authorization.js';

class userController {
  static async registration(req, res) {
    try {
      const userId = uuidv4();
      const cartId = uuidv4();
      await pool.query('INSERT INTO users VALUES ($1, $2, $3, $4);', [
        userId,
        req.body.name,
        req.body.email,
        await hash(req.body.password),
      ]);

      await pool.query('INSERT INTO cart VALUES ($1, $2);', [cartId, userId]);
      await pool.query('UPDATE users SET cart_id=$1 WHERE id=$2;', [
        cartId,
        userId,
      ]);

      const token = generateToken(userId, 'customer');

      res
        .status(200)
        .send({ name: req.body.name, email: req.body.email, token: token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async login(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const data = await pool.query('SELECT * FROM users WHERE email = $1;', [
        email,
      ]);

      if (data.rowCount == 0) {
        res.status(404).send('User not found!');
        return;
      }

      const user = data.rows[0];

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

  static async getAll(req, res) {
    try {
      const data = await pool.query(
        `SELECT id, name, email  FROM users WHERE role='customer';`
      );
      const users = data.rows;
      res.status(200).send(users);
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async getInfo(req, res) {
    try {
      const id = req.user.id;

      if (!id) {
        res.status(500).send('Something broke!');
        return;
      }

      const data = await pool.query(
        'SELECT email, name, role FROM users WHERE id=$1',
        [id]
      );

      if (data.rowCount == 0) {
        res.status(404).send('User not found!');
        return;
      }

      const user = data.rows[0];
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

  static async get(req, res) {
    try {
      const userId = req.query.id;

      if (!userId | !validate(userId)) {
        res.status(500).send('Query is empry or invalid!');
        return;
      }

      const data = await pool.query(
        'SELECT email, name, role FROM users WHERE id=$1',
        [userId]
      );

      if (data.rowCount == 0) {
        res.status(404).send('User not found!');
        return;
      }

      const user = data.rows[0];
      res.status(200).send({
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async delete(req, res) {
    try {
      const userId = req.query.id;

      if (!userId | !validate(userId)) {
        res.status(500).send('Query is empry or invalid!');
        return;
      }

      const data = await pool.query('DELETE FROM users WHERE id=$1;', [userId]);

      res.status(200).send('Success!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async update(req, res) {
    try {
      const { id, name, email, role } = req.body;

      if (!validate(id)) {
        res.status(500).send('ID is invalid!');
        return;
      }

      const data = await pool.query('SELECT * FROM users WHERE id=$1', [id]);

      if (data.rowCount == 0) {
        res.status(404).send('User not found!');
        return;
      }

      await pool.query(
        'UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4;',
        [name, email, role, id]
      );

      res.status(200).send({ id, name, email, role });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }
}

export default userController;
