import request from 'supertest';
import app from '../src/app.js';
import {
  createTestAdmin,
  getToken,
  createTestUser,
  createTestReport,
  createTestQuestion,
} from './helper.js';

let testAdmin;
let adminToken = '';

let testUser;
let userToken = '';

beforeAll(async () => {
  const adminUsername = 'reportsTestAdmin';
  const adminPassword = '123456';
  testAdmin = await createTestAdmin(adminUsername, adminPassword);
  adminToken = await getToken(adminUsername, adminPassword);

  const userUsername = 'reportsTestUser';
  const userPassword = '123456';
  testUser = await createTestUser(userUsername, userPassword);
  userToken = await getToken(userUsername, userPassword);
});

describe('GET /reports', () => {
  it('should return 401 without admin permissions', async () => {
    await request(app)
      .get('/reports')
      .set('authorization', `bearer ${userToken}`)
      .expect(401);
  });

  it('should return a list of reports', async () => {
    const testReport = await createTestReport(undefined, 'testReportGetReports');

    const { body: { reports = [] } = {} } = await request(app)
      .get('/reports')
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    if (reports.length <= 0) {
      await testReport.destroy();
      throw new Error('no reports returned');
    }

    await testReport.destroy();
  });
});

describe('DELETE /reports/:reportId', () => {
  it('should return 401 without admin permissions', async () => {
    // create test entry
    const testReport = await createTestReport(undefined, 'reportTestDeletePermission');

    await request(app)
      .delete(`/reports/${testReport.id}`)
      .set('authorization', `bearer ${userToken}`)
      .expect(401);

    // delete test entry
    await testReport.destroy();
  });

  it('should delete a report', async () => {
    // create test entries
    const testQuestion = await createTestQuestion('testReportQuestion');
    const testReport = await createTestReport(testQuestion.id, 'testReportDeleteReport');

    await request(app)
      .delete(`/reports/${testReport.id}`)
      .set('authorization', `bearer ${adminToken}`)
      .expect(200);

    // delete test entry
    await testQuestion.destroy();
  });
});

afterAll(async () => {
  await testAdmin.destroy();
  await testUser.destroy();
});
