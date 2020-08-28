import { getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

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
    const categoriesRepository = getCustomRepository(CategoriesRepository);
    const categoryInstace = await categoriesRepository.findOrCreateByTitle({
      title: category,
    });
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryInstace,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}
