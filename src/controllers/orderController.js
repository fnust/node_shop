import pool from '../dbconfig.js';
import { v4 as uuidv4, validate } from 'uuid';

class orderController {
  static async add(req, res) {
    try {
      const userId = req.user.id;

      if (!userId) {
        res.status(500).send('Something broke!');
        return;
      }

      let data = await pool.query('SELECT cart_id FROM users WHERE id=$1;', [
        userId,
      ]);
      const cartId = data.rows[0].cart_id;

      data = await pool.query(
        `SELECT product_id as id FROM carts_product WHERE cart_id=$1;`,
        [cartId]
      );

      const orderId = uuidv4();
      await pool.query('INSERT INTO orders VALUES ($1, $2, $3);', [
        orderId,
        userId,
        new Date(),
      ]);

      for (let i = 0; i < data.rowCount; ++i) {
        await pool.query(
          'INSERT INTO orders_product (order_id, product_id) VALUES ($1, $2);',
          [orderId, data.rows[i].id]
        );
      }

      const deleted = await pool.query(
        'DELETE from carts_product WHERE cart_id=$1;',
        [cartId]
      );

      await pool.query('UPDATE cart SET number=$1 WHERE id=$2;', [0, cartId]);

      res.status(200).send('Success!');
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
        'SELECT datetime, id as order_id FROM orders WHERE user_id=$1',
        [id]
      );

      let result = [];

      for (let i = 0; i < data.rowCount; ++i) {
        let products = await pool.query(
          'SELECT product_id as id FROM orders_product WHERE order_id=$1',
          [data.rows[i].order_id]
        );

        result.push({
          datetime: data.rows[i].datetime,
          products: products.rows,
        });
      }

      res.status(200).send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async get(req, res) {
    try {
      const id = req.query.id;

      if (!id) {
        res.status(500).send('Something broke!');
        return;
      }

      const data = await pool.query(
        'SELECT datetime, id as order_id FROM orders WHERE user_id=$1',
        [id]
      );

      let result = [];

      for (let i = 0; i < data.rowCount; ++i) {
        let products = await pool.query(
          'SELECT product_id as id FROM orders_product WHERE order_id=$1',
          [data.rows[i].order_id]
        );

        result.push({
          datetime: data.rows[i].datetime,
          products: products.rows,
        });
      }

      res.status(200).send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async delete(req, res) {
    try {
      const userId = req.query.id;

      if (!userId) {
        res.status(500).send('Something broke!');
        return;
      }

      const data = await pool.query('DELETE FROM orders WHERE user_id=$1;', [
        userId,
      ]);

      res.status(200).send('Success!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }
}

export default orderController;
