function normalizeAlias(alias: string) {
  return alias.trim().toLowerCase();
}

function isRemoteUrl(value?: string) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

function isLocalPath(value?: string) {
  return Boolean(value && !isRemoteUrl(value));
}

function resolveLocalFighterImage(value?: string) {
  if (!isLocalPath(value)) return null;

  const trimmed = (value as string).trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('/')) return trimmed;

  const fileName = trimmed.replace(/^\.?[\\/]+/, '').split(/[\\/]/).pop();
  if (!fileName) return null;

  return `/images/fighters/${fileName}`;
}

export function getFighterImageSrc(alias: string, imageUrl?: string) {
  const resolved = resolveLocalFighterImage(imageUrl);
  if (resolved) return resolved;
  return `/images/fighters/${normalizeAlias(alias)}.png`;
}

export function getFighterHoverImageSrc(alias: string, imageUrl?: string, hoverUrl?: string) {
  const hoverResolved = resolveLocalFighterImage(hoverUrl);
  if (hoverResolved) return hoverResolved;
  return getFighterImageSrc(alias, imageUrl);
}

export const FALLBACK_FIGHTER_IMAGE = '/images/fighters/sin-foto.png';
