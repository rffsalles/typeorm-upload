import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import CategoriesRepository from '../repositories/CategoriesRepository';

const categoriesRouter = Router();
categoriesRouter.get('/', async (request, response) => {
  const categoriesRepository = getCustomRepository(CategoriesRepository);
  const categories = await categoriesRepository.find();
  return response.json(categories);
});

export default categoriesRouter;
