# Poker Academy

Local-first study app for No-Limit Hold'em cash (6-max). Interactive theory, a math lab, a 13×13 range trainer, and decision quizzes.

```bash
npm install
npm run dev
```

## Deploy on Vercel

This is a static Vite app. Vercel builds `dist` and rewrites every path to `index.html` so Lessons / Play / Word list keep working on refresh.

```bash
npx vercel
```

Use `npx vercel --prod` for the production URL.

Open the printed URL. Progress is stored in `localStorage` on this browser.

Study charts are original educational approximations for learning range *shape*. They are not a commercial solver library.

**Play a table** uses publicly published hands:
- Pluribus vs humans (Brown & Sandholm, *Science* 2019), via the [pluribus-hand-parser](https://github.com/VitamintK/pluribus-hand-parser) conversion of Data File S1
- One televised pot from the [PHH dataset](https://github.com/uoftcprg/phh-dataset) (Dwan vs Ivey, 2009)

No real-money play. No poker-site accounts.
