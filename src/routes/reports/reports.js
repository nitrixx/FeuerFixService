import { Router } from 'express';
import { forbidden } from '../../commonErrors';
import { prefetchReport, getAllReports, deleteReport } from './handler';

const routes = Router();

routes.param('reportId', async(req, res, next, reportId) => {
  const { user: { isAdmin } } = req;
  if (!isAdmin) { return next(forbidden); }

  try {
    const report = await prefetchReport(reportId);
    req.report = report;
    return next();
  } catch (err) { return next(err); }
});

routes.get('/', async (req, res, next) => {
  const { user: { isAdmin } } = req;
  if (!isAdmin) { return next(forbidden); }

  try {
    const reports = await getAllReports();
    res.json({ reports });
  } catch (err) { return next(err); }
});

routes.delete('/:reportId', async (req, res, next) => {
  const { user: { isAdmin }, report } = req;
  if (!isAdmin) { return next(forbidden); }

  try {
    const response = await deleteReport(report);
    res.json(response);
  } catch (err) { return next(err); }
});

export default routes;
