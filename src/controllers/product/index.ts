import { validate } from 'uuid';
import { Product } from '../../model/entities/Product';
import { productRepo } from '../../model/repositories';
import { CreateReq, QueryReq, UpdateReq } from './interfaces';
import { Request, Response } from 'express';

class ProductController {
  static async create(req: CreateReq, res: Response) {
    try {
      const { name, producer, type, price, description } = req.body;

      let product: Product | null = new Product();
      product.name = name;
      product.producer = producer;
      product.type = type;
      product.price = price;
      product.description = description;

      product = await productRepo.create(product);

      if (!product) {
        res.status(500).send('Something broke!');
        return;
      }

      res.status(200).send({ name, producer, type, price, description });
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

      const product = await productRepo.findOne({}, { id: id });

      if (!product) {
        res.status(500).send('Something broke!');
        return;
      }
      res.status(200).send(product);
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const products = await productRepo.find({});

      res.status(200).send(products);
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

      if (await productRepo.deleteById(id)) {
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
      const { id, name, producer, type, price, description } = req.body;

      if (!validate(id)) {
        res.status(500).send('ID is invalid!');
        return;
      }

      let product = await productRepo.findOne({}, { id: id });

      if (!product) {
        res.status(404).send('Product not found!');
        return;
      }

      product.name = name;
      product.producer = producer;
      product.type = type;
      product.price = price;
      product.description = description;

      product = await productRepo.create(product);

      if (!product) {
        res.status(500).send('Something broke!');
        return;
      }

      res.status(200).send({ name, producer, type, price, description });
    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  }
}

export default ProductController;
