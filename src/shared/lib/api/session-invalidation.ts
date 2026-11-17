type AuthSessionInvalidationHandler = () => void;

let onInvalidated: AuthSessionInvalidationHandler | null = null;

export function registerAuthSessionInvalidation(
  handler: AuthSessionInvalidationHandler,
): void {
  onInvalidated = handler;
}

export function notifyAuthSessionInvalidated(): void {
  onInvalidated?.();
}