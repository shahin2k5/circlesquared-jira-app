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

resolver.define('updateAppSettings', async (req) => {
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
    if (!await circlesquared.hasCredentials()) {
      await circlesquared.requestCredentials()
    }
    // TODO: update app settings to CS
    const { payload } = req;

    const response = { active: true };
    return response;
});

export const handler = resolver.getDefinitions();
