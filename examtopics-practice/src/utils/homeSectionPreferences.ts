export const HOME_SECTION_PREFERENCES_PREFIX = 'examtopics:home-sections:v2:';

export const homeSectionOwner = (userId?: string) =>
  userId ? `user:${encodeURIComponent(userId)}` : 'guest';

export function clearHomeSectionPreferences(userId?: string): void {
  const prefix = `${HOME_SECTION_PREFERENCES_PREFIX}${homeSectionOwner(userId)}:`;
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) localStorage.removeItem(key);
    });
  } catch {
    // A storage restriction must not prevent sign-in or sign-out.
  }
}
