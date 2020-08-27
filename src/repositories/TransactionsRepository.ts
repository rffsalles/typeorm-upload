import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
export default class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);
    const totalTransactions = await transactionsRepository.find();
    const balance = totalTransactions.reduce(
      (accumulator: Balance, cur: Transaction) => {
        switch (cur.type) {
          case 'income':
            accumulator.income += cur.value;
            accumulator.total += cur.value;
            break;
          case 'outcome':
            accumulator.outcome += cur.value;
            accumulator.total -= cur.value;
            break;
          default:
            break;
        }
        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );
    return balance;
  }
}
