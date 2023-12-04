import pool from '../dbconfig.js';
import { v4 as uuidv4, validate } from 'uuid';

class productController {
  static async create(req, res) {
    try {
      const { name, producer, type, price, description } = req.body;

      await pool.query('INSERT INTO product VALUES ($1, $2, $3, $4, $5, $6);', [
        uuidv4(),
        name,
        producer,
        type,
        price,
        description,
      ]);

      res.status(200).send({ name, producer, type, price, description });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async get(req, res) {
    try {
      const productId = req.query.id;

      if (!productId | !validate(productId)) {
        res.status(500).send('Query is empry or invalid!');
        return;
      }

      const data = await pool.query('SELECT * FROM product WHERE id=$1', [
        productId,
      ]);

      if (data.rowCount == 0) {
        res.status(404).send('Product not found!');
        return;
      }

      const product = data.rows[0];
      res.status(200).send(product);
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async getAll(req, res) {
    try {
      const data = await pool.query(`SELECT *  FROM product;`);
      const products = data.rows;
      res.status(200).send(products);
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async delete(req, res) {
    try {
      const productId = req.query.id;

      if (!productId | !validate(productId)) {
        res.status(500).send('Query is empry or invalid!');
        return;
      }

      const data = await pool.query('DELETE FROM product WHERE id=$1;', [
        productId,
      ]);

      res.status(200).send('Success!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async update(req, res) {
    try {
      const { id, name, producer, type, price, description } = req.body;

      if (!validate(id)) {
        res.status(500).send('ID is invalid!');
        return;
      }

      const data = await pool.query('SELECT * FROM product WHERE id=$1', [id]);

      if (data.rowCount == 0) {
        res.status(404).send('Product not found!');
        return;
      }

      await pool.query(
        'UPDATE product SET name=$1, producer=$2, type=$3, price=$4, description=$5 WHERE id=$6;',
        [name, producer, type, price, description, id]
      );

      res.status(200).send({ id, name, producer, type, price, description });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }
}

export default productController;
