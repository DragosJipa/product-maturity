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
        progressBarBG: '#121212',
        cardBG: "#202020",
        radioBG: '#404040',
        customBG: '#262626',
        selectBG: '#1c1c1c',
        textAreaBG: '#161616',
        lineBG: '#3b3b3b',
        textInputBG: '#232323',
        borderTextAreaBG: '#474747',
        gradientModus: 'linear-gradient(90.01deg, #624BED 14.01%, #CE5682 80.31%)',
        'custom-gradient': 'linear-gradient(90.01deg, #624BED 14.01%, #CE5682 80.31%)',
        blackBox: '#141414',
      }
    },
    screens: {
      'large': '1024px',
      '3xl': '1800px',
    },
  },
  plugins: [],
}
