import { COLORS } from './avatar.config';
import { AvatarFromName } from './avatar.types';

const buildColor = (name: string) => {
  const sum = name.split('').reduce((_sum, char) => _sum + char.charCodeAt(0), 0);
  return COLORS[sum % (COLORS.length - 1)];
};

const buildInitials = (name: string) => {
  const [a, b] = name.trim().toUpperCase().split(/\s+/);
  if (b) {
    return a.charAt(0) + b.charAt(0);
  }
  return a.substring(0, 2);
};

export const buildAvatarFromName = (name: string): AvatarFromName => ({
  color: buildColor(name),
  initials: buildInitials(name),
});
