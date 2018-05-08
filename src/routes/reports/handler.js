import { Report, Question } from '../../models';
import { reportNotFound } from '../../commonErrors';

export async function prefetchReport(reportId) {
  const report = await Report.findById(reportId);
  if (!report) { throw reportNotFound; }
  return report;
}

export async function getAllReports() {
  const reports = await Report.findAll({ include: [Question] });
  return reports;
}

export async function deleteReport(dbReport) {
  await dbReport.destroy();
  return { message: 'Success.' };
}
