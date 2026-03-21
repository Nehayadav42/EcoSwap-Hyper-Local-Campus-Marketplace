/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["'Syne'", "sans-serif"],
        dm:   ["'DM Sans'", "sans-serif"],
      },
      colors: {
        bg:    "#08100a",
        s1:    "#0f170f",
        s2:    "#161f16",
        s3:    "#1c261c",
        s4:    "#233026",
        green: {
          eco:   "#3dff6e",
          dim:   "#2de05c",
          glow:  "rgba(61,255,110,0.28)",
          muted: "rgba(61,255,110,0.12)",
          faint: "rgba(61,255,110,0.06)",
        },
        offwhite: "#edf5ee",
        muted:    "#7a9480",
        border:   "#2e3e30",
        warn:     "#ffb347",
        danger:   "#ff5c5c",
        sky:      "#5ce0ff",
      },
      animation: {
        "float-slow":  "floatY 6s ease-in-out infinite",
        "float-med":   "floatY 7s 1s ease-in-out infinite",
        "float-fast":  "floatY 5s 2s ease-in-out infinite",
        "blink":       "blink 2s ease infinite",
        "card-in":     "cardIn 0.5s ease both",
        "fade-up":     "fadeUp 0.5s ease both",
        "bar-grow":    "barGrow 0.7s cubic-bezier(.22,1,.36,1) both",
      },
      keyframes: {
        floatY:  { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        blink:   { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
        cardIn:  { from: { opacity: 0, transform: "translateY(28px) scale(0.97)" }, to: { opacity: 1, transform: "none" } },
        fadeUp:  { from: { opacity: 0, transform: "translateY(18px)" }, to: { opacity: 1, transform: "none" } },
        barGrow: { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
      },
      boxShadow: {
        glow:   "0 0 40px rgba(61,255,110,0.25)",
        "glow-lg": "0 12px 48px rgba(61,255,110,0.3)",
        card:   "0 24px 60px rgba(0,0,0,0.5)",
        "card-lg": "0 40px 100px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(ellipse 800px 500px at 20% 40%, rgba(61,255,110,0.07) 0%, transparent 70%)",
        "auth-radial": "radial-gradient(ellipse 600px 500px at 0% 50%, rgba(61,255,110,0.07) 0%, transparent 70%)",
        "green-grad":  "linear-gradient(135deg, rgba(61,255,110,0.08) 0%, rgba(61,255,110,0.03) 100%)",
      },
    },
  },
  plugins: [],
};
