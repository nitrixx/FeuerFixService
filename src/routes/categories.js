import { Router } from 'express';
import { fachgebiete } from "../../models";

const routes = Router();

routes.get('/', async (req, res) => {
  const categories = await fachgebiete.findAll();
  res.json({ categories });
});

routes.get('/:id', async (req, res, next) => {
  const { params: { id } } = req;

  try {
    const category = await fachgebiete.findById(id);
    if(!category) {
      let err = new Error(`Category with id ${id} not found.`);
      err.status = 404;
      return next(err);
    }
    res.json(category);
  } catch (e) {
    return next(e);
  }
});

export default routes;
