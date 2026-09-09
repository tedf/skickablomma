/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // =====================================================================
        // SKICKABLOMMA — funktionell palett
        // =====================================================================
        // Positioneringen är neutral jämförelse, inte blomsterbutik. Därför
        // finns ingen rosa och ingen dekorfärg. Varje kulör har ett jobb:
        //
        //   brand   navigation, länkar, verifierat tillstånd
        //   signal  "Vårt val" och primär CTA — ingenting annat
        //   ink/muted/line/paper  allt övrigt
        //
        // Kategorin är upptagen: Interflora äger rött, Blomsterlandet grönt.
        // Djup teal läser botaniskt utan att krocka med någon av dem.

        brand: {
          DEFAULT: 'hsl(var(--brand))',
          50: '#eff6f4',
          100: '#d6e8e3',
          200: '#aed1c8',
          300: '#7fb3a7',
          400: '#4f8f81',
          500: '#2c7365',
          600: '#14524a', // Grundton
          700: '#10423c',
          800: '#0c332e',
          900: '#082421',
          foreground: 'hsl(var(--brand-foreground))',
        },

        signal: {
          DEFAULT: 'hsl(var(--signal))',
          50: '#fdf6ed',
          100: '#f8e6cf',
          200: '#efc99c',
          300: '#e0a765',
          400: '#cd873a',
          500: '#b4661e', // Grundton
          600: '#96521a',
          700: '#743f16',
          800: '#532d11',
          900: '#361d0b',
          foreground: 'hsl(var(--signal-foreground))',
        },

        // Neutraler. Varma, inte blå — sajten ska läsa som papper.
        paper: '#faf9f6',
        surface: '#ffffff',
        ink: {
          DEFAULT: '#17191c',
          muted: '#5c6069',
          faint: '#8b8f97',
        },
        line: {
          DEFAULT: '#e5e2db',
          strong: '#d2cec5',
        },

        // Bakåtkompatibla alias. Kod som redan säger `primary` får den nya
        // varumärkesfärgen i stället för den rosa. Använd `brand` i ny kod.
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        // Inter för allt som ska läsas snabbt, särskilt tabeller — den har
        // äkta tabulära siffror, vilket en jämförelsesajt inte klarar sig utan.
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // Newsreader ersätter Playfair Display. Playfair är en romantisk
        // display-serif som signalerar bröllop och blomsterbutik. Newsreader
        // är en redaktionell brödtextserif och läser som ett uppslagsverk.
        display: ['var(--font-newsreader)', 'Georgia', 'serif'],
      },
      fontFeatureSettings: {
        tabular: '"tnum" 1, "cv05" 1',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      typography: {
        /*
          `prose` användes på fem sidor utan att pluginet var installerat, så
          all brödtext renderades ostilad: H2 i brödtextstorlek, inga
          listpunkter, ingen styckemarginal. Nu bunden till varumärket.
        */
        DEFAULT: {
          css: {
            '--tw-prose-body': '#17191c',
            '--tw-prose-headings': '#17191c',
            '--tw-prose-links': '#14524a',
            '--tw-prose-bold': '#17191c',
            '--tw-prose-bullets': '#8b8f97',
            '--tw-prose-quotes': '#5c6069',
            '--tw-prose-hr': '#e5e2db',
            '--tw-prose-counters': '#5c6069',
            maxWidth: 'none',
            h2: {
              fontFamily: 'var(--font-newsreader), Georgia, serif',
              fontWeight: '400',
              letterSpacing: '-0.015em',
              marginTop: '2.5em',
              marginBottom: '0.75em',
            },
            h3: {
              fontFamily: 'var(--font-newsreader), Georgia, serif',
              fontWeight: '500',
              letterSpacing: '-0.01em',
              marginTop: '1.75em',
              marginBottom: '0.5em',
            },
            a: {
              textDecorationColor: '#aed1c8',
              textUnderlineOffset: '2px',
            },
          },
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}

export default config
