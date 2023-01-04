import Resolver from '@forge/resolver';

import { getAppSettings, getUser } from './helper';

const resolver = new Resolver();

resolver.define('getUser', getUser);

resolver.define('getAppSettings', getAppSettings);

resolver.define('getIssueRuns', (req) => {
  return [
    { id: 1, name: "Run 1", date: "2022-12-12", status: { passed: 3, failed: 0, blocked: 0, invalid: 1, skipped: 0 } },
    { id: 2, name: "Run 2", date: "2022-12-12", status: { passed: 0, failed: 0, blocked: 0, invalid: 0, skipped: 0 } },
    { id: 3, name: "Run 3", date: "2022-12-12", status: { passed: 0, failed: 2, blocked: 0, invalid: 0, skipped: 0 } },
    { id: 4, name: "Run 4", date: "2022-12-12", status: { passed: 0, failed: 0, blocked: 0, invalid: 5, skipped: 0 } },
    { id: 5, name: "Run 5", date: "2022-12-12", status: { passed: 0, failed: 0, blocked: 0, invalid: 0, skipped: 0 } },
    { id: 6, name: "Run 6", date: "2022-12-12", status: { passed: 0, failed: 0, blocked: 0, invalid: 0, skipped: 0 } },
    { id: 7, name: "Run 7", date: "2022-12-12", status: { passed: 0, failed: 0, blocked: 0, invalid: 0, skipped: 0 } },
    { id: 8, name: "Run 8", date: "2022-12-12", status: { passed: 0, failed: 0, blocked: 0, invalid: 0, skipped: 0 } },
    { id: 9, name: "Run 9", date: "2022-12-12", status: { passed: 3, failed: 0, blocked: 0, invalid: 0, skipped: 0 } },
    { id: 10, name: "Run 10", date: "2022-12-12", status: { passed: 0, failed: 0, blocked: 2, invalid: 0, skipped: 0 } },
  ];
});

export const handler = resolver.getDefinitions();
