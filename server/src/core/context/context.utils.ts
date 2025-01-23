import { LocaleId } from './context.types';

export const getLocaleIdList = (): string[] => ['fr', 'en'] satisfies LocaleId[];

export const isLocaleId = (value?: string): value is LocaleId => !!value && getLocaleIdList().includes(value);
