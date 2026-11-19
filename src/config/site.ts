// The site's texts (title, description, slogan) are in the dictionaries
export const SITE_CONFIG = {
  // TODO: replace with the real agency name and email
  name: 'dialog',
  email: 'muhametdinov.work@gmail.com',
  // NEXT_PUBLIC_SITE_URL overrides it (e.g. for a staging server); it is read at build time
  // Read the public value directly so browser components don't bundle server env validation/Zod.
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bydialog.ru',
  themeColor: '#e8e8e3'
} as const
