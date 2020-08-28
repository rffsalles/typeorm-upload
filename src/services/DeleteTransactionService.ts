// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<boolean> {
    const categoriesRepository = getCustomRepository(TransactionsRepository);
    const { affected } = await categoriesRepository.delete(id);
    if (affected && affected > 0) {
      return true;
    }
    throw new AppError('Not Found', 404);
  }
}
export default DeleteTransactionService;
