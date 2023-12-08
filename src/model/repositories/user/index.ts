import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../../entities/User';
import dataSource from '../../../ormconfig';

class UserRepo {
  readonly repository: Repository<User>;

  constructor() {
    this.repository = dataSource.getRepository(User);
  }

  async create(user: User): Promise<User | null> {
    try {
      return await this.repository.save(user);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async findOne(
    relation: FindOptionsRelations<User>,
    param: FindOptionsWhere<User>
  ): Promise<User | null> {
    return this.repository.findOne({
      relations: relation,
      where: param,
    });
  }

  public async find(param: FindOptionsWhere<User>): Promise<User[] | null> {
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

export default UserRepo;
