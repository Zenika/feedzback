import { COLORS } from './avatar.config';

export const buildAvatarBgColor = (name: string) => {
  const sum = name.split('').reduce((_sum, char) => _sum + char.charCodeAt(0), 0);
  return COLORS[sum % (COLORS.length - 1)];
};

export const buildAvatarInitial = (name: string) => name.trim().toUpperCase().charAt(0);
