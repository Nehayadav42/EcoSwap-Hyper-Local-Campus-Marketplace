# UniThrift — Campus Sustainable Marketplace

A React + Tailwind CSS frontend for a hyper-local, peer-to-peer campus marketplace exclusively for `.edu.in` college students.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| React Router DOM | 6 | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first styling |
| PostCSS | 8 | CSS processing |
| Google Fonts | — | Syne + DM Sans |

---

## 🖥 Screens

| Route | Screen | Description |
|-------|--------|-------------|
| `/` | Landing | Hero, stats, how-it-works, features, categories, testimonials, CTA |
| `/login` | Login | Email/password + Google SSO |
| `/register` | Register | Full signup form with password strength meter |
| `/verify` | Email Verify | OTP input with live countdown timer |
| `/chat` | Chat | 3-column live chat with offer cards |
| `/dashboard` | Dashboard | Metrics, bar chart, donut chart, activity feed, eco tracker |

---

## 🎨 Design System

### Colors (defined in `tailwind.config.js`)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#08100a` | Page background |
| `s1` | `#0f170f` | Card / sidebar background |
| `s2` | `#161f16` | Input / hover background |
| `s3` | `#1c261c` | Subtle element background |
| `green.eco` | `#3dff6e` | Primary accent — CTAs, prices, eco stats |
| `offwhite` | `#edf5ee` | Primary text |
| `muted` | `#7a9480` | Secondary text |
| `warn` | `#ffb347` | XP bars, leaderboard gold |
| `danger` | `#ff5c5c` | Errors, decline buttons |

### Typography
- **Syne** — headings, prices, numbers (font-syne)
- **DM Sans** — body text, labels, buttons (font-dm)

### Custom Animations (in tailwind.config.js)
- `animate-float-slow` — main hero card (6s)
- `animate-float-med`  — side card top (7s)
- `animate-float-fast` — side card bottom (5s)
- `animate-card-in`    — auth card entrance
- `animate-fade-up`    — hero text stagger
- `animate-blink`      — live indicator dot

---

## 📁 Project Structure

```
src/
├── index.js              # App entry point
├── index.css             # Tailwind directives + global styles
├── App.js                # Router setup
├── components/
│   ├── Navbar.js         # Top navigation bar
│   ├── TabBar.js         # Bottom screen switcher
│   └── AuthLayout.js     # Shared auth screen wrapper
└── pages/
    ├── Landing.js        # Homepage / landing screen
    ├── Login.js          # Sign in screen
    ├── Register.js       # Sign up screen
    ├── Verify.js         # OTP email verification
    ├── Chat.js           # Live haggling chat
    └── Dashboard.js      # Eco dashboard + profile
```

---

## 🔧 Customization

### Change primary color
In `tailwind.config.js`, update `green.eco`:
```js
green: {
  eco: '#3dff6e',  // ← change this
}
```

### Add a new screen
1. Create `src/pages/NewPage.js`
2. Add a route in `src/App.js`
3. Add a tab in `src/components/TabBar.js`

### Connect to backend (MERN)
- Replace hardcoded data in each page with `useEffect` + `fetch` / `axios` calls
- Add an `AuthContext` for JWT token management
- Use React Router's `<Navigate>` for protected routes

---

## 🌿 Eco Design Choices

- **Dark mode first** — Gen-Z students code and browse at night
- **Green as action** — `#3dff6e` reserved only for CTAs and eco metrics
- **CO₂ everywhere** — carbon savings shown on cards, chat, profile, leaderboard
- **Syne font** — geometric startup-forward display, not generic

---

Built with 💚 for sustainable campus life.
