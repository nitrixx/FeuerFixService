import { Category, Question, Answer } from "../../models";
import { createError } from "../../util";
import { categoryNotFound } from "../../commonErrors";

export async function getCategories() {
  return await Category.findAll({
    attributes: ['id', 'name']
  });
}

export async function createCategory(name) {
  const category = await Category.findOne({ where: { name } });
  if (category) {
    throw createError(`Category with name ${name} already exists`, 400);
  }
  return await Category.create({ name });
}

export async function prefetchCategory(categoryId) {
  const category = await Category.findById(categoryId, {
    attributes: ['id', 'name'],
    include: [{ model: Question, include: [Answer] }],
  });
  if (!category) { throw categoryNotFound; }
  return category;
}

export async function deleteCategory(dbCategory) {
  await Promise.all(dbCategory.Questions // eslint-disable-line no-undef
    .map(async q => await q.destroy()));
  await dbCategory.destroy();
  return { message: 'Success' };
}
