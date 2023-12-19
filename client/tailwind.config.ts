import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],

  corePlugins: {
    // Warning: Tailwind "Preflight" breaks some Angular material components
    //
    // Learn more about this issue and a hack to solve it:
    //    https://github.com/tailwindlabs/tailwindcss/discussions/9993
    //
    // The hack is available here: `src/styles/tailwind.css`
    preflight: false,
  },

  theme: {
    extend: {},
  },

  plugins: [],
} satisfies Config;
