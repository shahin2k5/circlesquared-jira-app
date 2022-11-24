import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('getUser', async (req) => {
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
    if (!await circlesquared.hasCredentials()) {
      await circlesquared.requestCredentials()
    }
    const response = await circlesquared.fetch(`/api/user/profile`, { headers: { "Accept": "application/json" } });
    if (response.ok) {
      try {
        const profile = await response.json();
        return profile;
      } catch(error) {
        console.log(error)
      }
    }
    return {
      status: response.status,
      statusText: response.statusText,
      text: await response.text(),
    }
});

resolver.define('getAppSettings', async (req) => {
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
    if (!await circlesquared.hasCredentials()) {
      await circlesquared.requestCredentials()
    }
    // TODO: get app settings from CS

    const response = { active: true };
    return response;
});

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
