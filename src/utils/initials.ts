export const getInitials = (value?: string | null, fallback = 'SP'): string => {
  const source = value?.trim();
  if (!source) return fallback;

  const initials = source
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return initials || fallback;
};
