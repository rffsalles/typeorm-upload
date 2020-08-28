import { getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
export default class CreateTransactionService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Invalid transaction type!');
    }
    if (value === 0) {
      throw new Error('Value must be greater then zero!');
    }

    const categoriesRepository = getCustomRepository(CategoriesRepository);
    const categoryInstance = await categoriesRepository.findOrCreateByTitle({
      title: category,
    });
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { total } = await transactionsRepository.getBalance(null);
    if (type === 'outcome' && total < value) {
      throw new AppError('insufficient founds', 400);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryInstance,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}
