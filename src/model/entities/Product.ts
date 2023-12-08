import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  producer: string;

  @Column()
  type: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  price: number;

  @Column({ nullable: true })
  description: string;
}
