import Resolver from '@forge/resolver';
import { getAppSettings, getUser } from './helper';

const resolver = new Resolver();

resolver.define('getUser', async (req) => {
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
  if (!await circlesquared.hasCredentials()) {
    await circlesquared.requestCredentials()
  }
  const response = await circlesquared.fetch(`/api/profile`, { headers: { "Accept": "application/json" } });
 
  if (response.ok) {
    try {
      const profile = await response.json();
      console.log('fn-page-profile::',profile )
      return profile;
    } catch(error) {
      return new Error("Failed to fetch CircleSquared profile");
    }
  }
  return {
    status: response.status,
    statusText: response.statusText,
    text: await response.text(),
  }
});

resolver.define('getAppSettings', getAppSettings);

resolver.define('updateAppSettings', async (req) => {
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
    if (!await circlesquared.hasCredentials()) {
      await circlesquared.requestCredentials()
    }
    const { payload } = req;
    const response = await circlesquared.fetch(`/api/app/jira/settings`, {
      method: 'PUT',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({...payload, app_name: 'CircleSquared-Test-management-for-Jira'})
    });

    const { data: settings } = await response.json();

    return settings;
});

export const handler = resolver.getDefinitions();
