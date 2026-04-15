# 💀 Will I Survive This?

> *A morbid historical fate calculator. Enter a year from history and your modern profession — discover, in gloriously grim detail, exactly how swiftly you would have perished.*

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-blue?style=flat-square&logo=google)

---

## ✨ Features

- 🕰️ Enter any **historical year** (3000 BC – 2024)
- 💼 Enter your **modern profession**
- 📜 Fetches **real historical context** from the Wikipedia API
- 🤖 Passes events + profession to **Gemini 1.5 Flash** for a morbid, sarcastic fate story
- 📊 Returns a **Survival Probability %** + **life expectancy in days** + **cause of death**
- 🎭 Dark, dramatic UI with animations, glowing skulls, and a survival meter

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/sanmithsj1103/will-i-survive.git
cd will-i-survive
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your environment

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then open `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=AIzaSy...your-key-here
```

Get a key at → https://aistudio.google.com/app/apikey

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom CSS |
| Fonts | Cinzel, Crimson Text, Inter (Google Fonts) |
| Historical Data | Wikipedia REST API |
| AI Story Generation | Google Gemini 1.5 Flash |

---

## 📁 Project Structure

```
src/
└── app/
    ├── api/
    │   └── fate/
    │       └── route.ts      # API route: Wikipedia + OpenAI
    ├── globals.css            # Dark theme, animations, custom styles
    ├── layout.tsx             # Root layout + SEO metadata
    └── page.tsx               # Main UI (client component)
```

---

## ⚠️ Important Notes

- **Never commit `.env.local`** — it is already in `.gitignore` and contains your secret API key
- The app uses **Gemini 1.5 Flash** for blazing fast, cost-efficient story generation
- Wikipedia API is used without authentication; it may occasionally rate-limit heavily

---

## 📜 License

MIT — use it, fork it, perish with it.

---

*Memento Mori* ☠️