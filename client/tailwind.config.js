// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibm-plex-mono': ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        radioBG: '#404040',
        customBG: '#262626',
        selectBG: '#1c1c1c',
        textAreaBG: '#161616',
        borderTextAreaBG: '#474747',
      }
    },
  },
  plugins: [],
}
