import { Router } from 'express';
// import { users, reported, UserBilder } from '../../models'

const routes = Router();

// This is for dev only!
// routes.get('/', async (req, res) => {
//   const usrs = await users.findAll({ include: [ UserBilder ] });
//   res.json({ users: usrs });
// });

// This is for dev only!
// returns the number of reported answered for a user
// routes.get('/:uId', async (req, res, next) => {
//   const { params: { uId: UserID } } = req;

//   try {
//     const reportedAnsweres = await reported.findAll({ where: { UserID } });
//     if (reportedAnsweres) {
//       res.json({ reportedAnsweres: reportedAnsweres.length });
//     } else {
//       let err = new Error('Probably no user with this id found..');
//       err.status = 404;
//       return next(err);
//     }
//   } catch(e) {
//     return next(e);
//   }
// });

// This is for dev only!
// routes.get('/pictures', async (req, res) => {
//   const pictures = await UserBilder.findAll({});
//   res.json({ pictures });
// });

export default routes;
