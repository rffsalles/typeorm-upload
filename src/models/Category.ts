import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';

import Transaction from './Transaction';

@Entity('categories')
@Unique(['title'])
class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transaction: Transaction;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Category;
