import { EntityRepository, Repository } from 'typeorm';
import Category from '../models/Category';

@EntityRepository(Category)
export default class CategoriesRepository extends Repository<Category> {
  public async findOrCreateByTitle({
    title,
  }: Omit<
    Category,
    'id' | 'created_at' | 'created_at' | 'updated_at'
  >): Promise<Category> {
    const findCategory = await this.findOne({ where: { title } });
    if (!findCategory) {
      const createdCategory = this.create({ title });
      await this.save(createdCategory);
      return createdCategory;
    }
    return findCategory;
  }
}
