import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
    res.redirect('/info.html');
});

export default routes;