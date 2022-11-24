import { AuthProfile } from '@forge/response';

export const retriever = (response) => {
  const { status, body: externalProfile } = response;

  if (status === 200){
    return new AuthProfile({
      id: `${externalProfile.user.id}`,
      displayName: externalProfile.user.name,
    });
  } else {
    throw new Error(`Could not determine profile information. HTTP ${status}`);
  }
}