
# OneTapConvert

OneTapConvert is a simple currency converter web application built with [Next.js](https://nextjs.org). It allows users to quickly convert between US Dollars (USD) and Colombian Pesos (COP) using the latest exchange rate, which is fetched from exchangerate.host and cached on the server once per day for efficiency.


## Features

- Convert between USD and COP instantly as you type
- Switch conversion direction (USD → COP or COP → USD) with one tap
- Multiply the input amount by 1,000 or 1,000,000 with quick buttons
- The latest exchange rate is fetched from exchangerate.host and cached on the server once per day
- Clean, responsive UI built with Tailwind CSS

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up your exchangerate.host API key:**

   - Register for a free API key at [exchangerate.host](https://exchangerate.host/)
   - Create a `.env.local` file in the project root and add:

     ```env
     NEXT_PUBLIC_EXCHANGERATE_API_KEY=your_api_key_here
     ```

3. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Production Build

To build and start the app in production mode:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## How It Works

- The exchange rate is fetched from exchangerate.host via a server-side API route (`/api/exchange-rate`).
- The server caches the exchange rate in a local file and only fetches a new rate once per day.
- The client fetches the rate from the server API, not directly from the external service.
- No user data or preferences are stored in the browser.

## Project Structure

- `app/components/CurrencyConverter.tsx` – Main currency converter component
- `app/api/exchange-rate/route.ts` – Serverless API route for fetching/caching the exchange rate
- `exchange-rate-cache.json` – Server-side cache file for the daily exchange rate

## License

MIT


