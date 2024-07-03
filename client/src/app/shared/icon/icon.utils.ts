export const mapToIconClass = <T = string>(value: T) => (value !== 'none' ? `app-icon--${value}` : '');
