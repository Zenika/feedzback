export const isAllowedEmailDomain = (email: string, domains: string[]): boolean => {
  const [, domain] = email.split('@');
  return domains.includes(domain);
};

