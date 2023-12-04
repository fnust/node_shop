import pool from '../dbconfig.js';

class cartController {
  static async add(req, res) {
    try {
      const userId = req.user.id;
      const productId = req.body.id;

      if (!userId | !productId) {
        res.status(500).send('Something broke!');
        return;
      }

      const data = await pool.query(
        'SELECT cart_id, number FROM users JOIN cart ON users.id=cart.user_id WHERE users.id=$1;',
        [userId]
      );
      const cartId = data.rows[0].cart_id;
      const number = data.rows[0].number;

      await pool.query(
        'INSERT INTO carts_product (cart_id, product_id) VALUES ($1, $2);',
        [cartId, productId]
      );

      await pool.query('UPDATE cart SET number=$1 WHERE id=$2;', [
        number + 1,
        cartId,
      ]);

      return res.status(200).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async get(req, res) {
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

      return res
        .status(200)
        .send({ number: data.rowCount, products: data.rows });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async delete(req, res) {
    try {
      const userId = req.user.id;
      const productId = req.query.id;

      if (!userId | !productId) {
        res.status(500).send('Something broke!');
        return;
      }

      const data = await pool.query(
        'SELECT cart_id, number FROM users JOIN cart ON users.id=cart.user_id WHERE users.id=$1;',
        [userId]
      );
      const cartId = data.rows[0].cart_id;
      const number = data.rows[0].number;

      const deleted = await pool.query(
        'DELETE from carts_product WHERE cart_id=$1 AND product_id=$2;',
        [cartId, productId]
      );

      await pool.query('UPDATE cart SET number=$1 WHERE id=$2;', [
        number - deleted.rowCount,
        cartId,
      ]);

      return res.status(200).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }
}

export default cartController;
