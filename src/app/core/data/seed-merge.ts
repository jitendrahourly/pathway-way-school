type SeedObject = Record<string, unknown>;

function isSeedObject(value: unknown): value is SeedObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Merges saved page content over its seed defaults, using the seed's shape as
 * the contract. Records saved before a section (or a field inside one) existed
 * therefore still render that section instead of an undefined value.
 *
 * Missing groups and fields fall back to the seed. Lists are replaced as a
 * whole when the saved record has one, and saved values are otherwise kept as
 * they are, including deliberately empty strings.
 */
export function mergeWithSeed<T>(defaults: T, saved: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(saved) ? saved : defaults) as T;
  }

  if (isSeedObject(defaults)) {
    if (!isSeedObject(saved)) return defaults;

    const merged: SeedObject = { ...defaults };
    for (const key of Object.keys(defaults)) {
      merged[key] = mergeWithSeed(defaults[key], saved[key]);
    }
    return merged as T;
  }

  return typeof saved === typeof defaults ? (saved as T) : defaults;
}
