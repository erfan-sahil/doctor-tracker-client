type AccessTokenListener = (token: string | null) => void;

let accessToken: string | null = null;
const listeners = new Set<AccessTokenListener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;

  for (const listener of listeners) {
    listener(token);
  }
}

export function clearAccessToken(): void {
  setAccessToken(null);
}

export function subscribeAccessToken(listener: AccessTokenListener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
