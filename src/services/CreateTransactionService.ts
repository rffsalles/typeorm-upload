import { getCustomRepository, getRepository } from 'typeorm';
// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import Category from '../models/Category';

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

    const categoryRepository = getRepository(Category);
    let transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(transactionCategory);
    }
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { total } = await transactionsRepository.getBalance(null);
    if (type === 'outcome' && total < value) {
      throw new AppError('insufficient funds', 400);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}
