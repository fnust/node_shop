import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import dataSource from '../../../ormconfig';
import { Product } from '../../entities/Product';

class ProductRepo {
  readonly repository: Repository<Product>;

  constructor() {
    this.repository = dataSource.getRepository(Product);
  }

  async create(product: Product): Promise<Product | null> {
    try {
      return await this.repository.save(product);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async findOne(
    relation: FindOptionsRelations<Product>,
    param: FindOptionsWhere<Product>
  ): Promise<Product | null> {
    return this.repository.findOne({
      relations: relation,
      where: param,
    });
  }

  public async find(
    param: FindOptionsWhere<Product>
  ): Promise<Product[] | null> {
    return this.repository.find({
      where: param,
    });
  }

  public async deleteById(id: string): Promise<boolean> {
    try {
      await this.repository.delete({
        id,
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

export default ProductRepo;
