import { COLORS } from './avatar.config';
import { AvatarFromName } from './avatar.types';

const getColor = (name: string) => {
  const sum = name.split('').reduce((_sum, char) => _sum + char.charCodeAt(0), 0);
  return COLORS[sum % (COLORS.length - 1)];
};

const getInitial = (name: string) => name.trim().toUpperCase().charAt(0);

export const buildAvatarFromName = (name: string): AvatarFromName => ({
  color: getColor(name),
  initial: getInitial(name),
});
