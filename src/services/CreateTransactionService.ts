import { getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
export default class CreateTransactionService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute({ title, value, type }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // console.log(transactionsRepository.getBalance());
    // const transactionRepository = getRepository(Transaction);
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
    });
    await transactionsRepository.save(transaction);
    return transaction;
    // return { title, value };
  }
}
