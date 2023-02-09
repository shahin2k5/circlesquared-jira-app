import api from '@forge/api';

export const getUser = async (req) => {
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
  if (!await circlesquared.hasCredentials()) {
    await circlesquared.requestCredentials()
  }
  const response = await circlesquared.fetch(`/api/profile`, { headers: { "Accept": "application/json" } });
  console.log('outside')
  if (response.ok) {
    
    try {
      const profile = await response.json();
      console.log('oke',profile )
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
}

export const getAppSettings = async (req) => {
  const circlesquared = api.asUser().withProvider('circlesquared', 'circlesquared-apis')
  if (!await circlesquared.hasCredentials()) {
    await circlesquared.requestCredentials()
  }
  const response = await circlesquared.fetch(`/api/app/jira/settings`, { headers: { "Accept": "application/json" } });
  const { data: settings } = await response.json();
  return settings || {};
}

