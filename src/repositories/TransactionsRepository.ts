import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Transactions {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
export default class TransactionsRepository extends Repository<Transaction> {
  public async getTransactions(): Promise<Transactions> {
    const transactions = await this.find();
    return {
      transactions,
      balance: await this.getBalance(transactions),
    };
  }

  public async getBalance(
    transactions: Transaction[] | null,
  ): Promise<Balance> {
    const totalTransactions = transactions || (await this.find());

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
