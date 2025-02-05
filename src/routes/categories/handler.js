import { Category, Question, Answer } from "../../models";
import { createError } from "../../util";
import { categoryNotFound } from "../../commonErrors";

export async function getCategories() {
  const categories = await Category.findAll({
    attributes: ['id', 'name'],
    include: [Question],
  });

  return categories.map(c => ({
    id: c.id,
    name: c.name,
    questionCount: c.Questions.length,
  }))
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

export async function updateCategory(dbCategory, name) {
  const category = await Category.findOne({ where: { name } });
  if (category) {
    throw createError(`Category with name ${name} already exists`, 400);
  }

  dbCategory.name = name;
  await dbCategory.save();
  return dbCategory;
}
