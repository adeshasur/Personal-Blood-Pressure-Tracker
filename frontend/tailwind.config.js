module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bp-normal': '#10b981',
        'bp-elevated': '#f59e0b',
        'bp-high': '#ef4444',
      },
      backdropFilter: {
        'glass': 'blur(10px)',
      },
    },
  },
  plugins: [],
}
