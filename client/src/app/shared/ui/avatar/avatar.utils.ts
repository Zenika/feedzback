import { COLORS } from './avatar.config';
import { AvatarInitial } from './avatar.types';

const getColor = (name: string) => {
  const sum = name.split('').reduce((_sum, char) => _sum + char.charCodeAt(0), 0);
  return COLORS[sum % (COLORS.length - 1)];
};

const getValue = (name: string) => name.trim().toUpperCase().charAt(0);

export const buildInitial = (name: string): AvatarInitial => ({
  color: getColor(name),
  value: getValue(name),
});
