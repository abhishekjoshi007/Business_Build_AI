/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: 'class',
  theme: {
    extend: {
      maskImage: {
        'radial': 'radial-gradient(100% 100% at top right, white, transparent)',
      },
      backgroundImage: ({ theme }) => ({
        'vc-border-gradient': `radial-gradient(at left top, ${theme(
          'colors.purple.600',
        )}, 50px, ${theme('colors.purple.800')} 50%)`,
      }),
      keyframes: ({ theme }) => ({
        rerender: {
          '0%': {
            borderColor: theme('colors.purple.500'),
          },
          '40%': {
            borderColor: theme('colors.purple.500'),
          },
        },
        highlight: {
          '0%': {
            background: theme('colors.purple.500'),
            color: theme('colors.white'),
          },
          '40%': {
            background: theme('colors.purple.500'),
            color: theme('colors.white'),
          },
        },
        loading: {
          '0%': {
            opacity: '.2',
          },
          '20%': {
            opacity: '1',
            transform: 'translateX(1px)',
          },
          to: {
            opacity: '.2',
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        translateXReset: {
          '100%': {
            transform: 'translateX(0)',
          },
        },
        fadeToTransparent: {
          '0%': {
            opacity: '1',
          },
          '40%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
      }),
      colors: {
        brand: {
          light: '#F3F4F6', // equivalent to gray-100
          DEFAULT: '#A78BFA', // purplish color
          dark: '#1E1D1F',  // deep purplish black
        },
          "vercel-pink": "#ec4899",
          "vercel-blue": "#3b82f6",
          "vercel-cyan": "#06b6d4",
          "vercel-orange": "#f97316",
          "vercel-green": "#10b981",
          "vercel-red": "#ef4444",
          "vercel-teal": "#14b8a6",
        nav: {
          activeLight: '#F3F4F6', // purplish active link background (light mode)
          activeTextLight: '#1F2937', // active text color for light mode
          inactiveLight: '#6B7280', // muted text for inactive links
          inactiveLightHoverBg: '#E5E7EB',
          inactiveLightHoverText: '#1F2937',
          activeDark: '#1F1D2B', // deep purple background for dark mode
          activeTextDark: '#F9FAFB', // light text for active links in dark mode
          inactiveDark: '#D1D5DB',
          inactiveDarkHoverBg: '#4B5563',
          inactiveDarkHoverText: '#F9FAFB',
        },
        purple: {
          50: '#F3E8FF',
          100: '#D6A0FF',
          200: '#B473FF',
          300: '#9E4DFF',
          400: '#8A2DFF',
          500: '#7A1FFF', // Brand color
          600: '#6412D6',
          700: '#5210A2',
          800: '#400C77',
          900: '#300C55', // darker purple for dark mode backgrounds
        },
        blackPurple: {
          100: '#1F1D2B', // Darker shade for backgrounds
          200: '#2E2A3D',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
