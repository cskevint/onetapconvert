import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'exchange-rate-cache.json');
const CURRENCY = 'COP';
const ACCESS_KEY = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY;

async function fetchExchangeRate() {
  const url = `https://api.exchangerate.host/live?access_key=${ACCESS_KEY}&currencies=${CURRENCY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data && data.success && data.quotes && typeof data.quotes[`USD${CURRENCY}`] === 'number') {
    return data.quotes[`USD${CURRENCY}`];
  }
  throw new Error('Failed to fetch exchange rate');
}

function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {}
  return null;
}

function writeCache(rate: number, date: string) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ rate, date }), 'utf-8');
}

export async function GET(req: NextRequest) {
  const today = new Date().toISOString().slice(0, 10);
  let cache = readCache();
  if (cache && cache.date === today) {
    return NextResponse.json({ rate: cache.rate, date: cache.date, cached: true });
  }
  try {
    const rate = await fetchExchangeRate();
    writeCache(rate, today);
    return NextResponse.json({ rate, date: today, cached: false });
  } catch (e) {
    if (cache) {
      // fallback to cached value if available
      return NextResponse.json({ rate: cache.rate, date: cache.date, cached: true, error: 'Using cached value due to fetch error.' });
    }
    return NextResponse.json({ error: 'Unable to fetch or cache exchange rate.' }, { status: 500 });
  }
}
