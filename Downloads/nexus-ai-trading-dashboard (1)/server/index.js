const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// Simple indicators copied from frontend logic for parity
function sma(values, period) {
  const out = Array(values.length).fill(null);
  if (period <= 0) return out;
  let sum = 0;
  for (let i = 0; i < values.length; i += 1) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

function rsi(values, period = 14) {
  const out = Array(values.length).fill(null);
  if (values.length < period + 1) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i += 1) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gain += diff;
    else loss -= diff;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  for (let i = period + 1; i < values.length; i += 1) {
    const diff = values[i] - values[i - 1];
    const g = Math.max(diff, 0);
    const l = Math.max(-diff, 0);
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

function linearRegressionForecast(prices, lookback = 30) {
  const arr = prices.slice(-lookback);
  const n = arr.length;
  if (n < 3) return { nextPrice: prices.at(-1) ?? 0, slope: 0 };
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (let i = 0; i < n; i += 1) {
    sumX += i;
    sumY += arr[i];
    sumXY += i * arr[i];
    sumXX += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;
  const nextPrice = intercept + slope * n;
  return { nextPrice, slope };
}

function movingAverageCrossoverSignal(prices, fast = 9, slow = 21) {
  if (prices.length < slow + 2) return "HOLD";
  const fastSma = sma(prices, fast);
  const slowSma = sma(prices, slow);
  const prevFast = fastSma.at(-2);
  const prevSlow = slowSma.at(-2);
  const curFast = fastSma.at(-1);
  const curSlow = slowSma.at(-1);
  if (prevFast == null || prevSlow == null || curFast == null || curSlow == null) return "HOLD";
  if (prevFast <= prevSlow && curFast > curSlow) return "BUY";
  if (prevFast >= prevSlow && curFast < curSlow) return "SELL";
  return "HOLD";
}

function confidenceFromSlope(slope, currentPrice) {
  if (!Number.isFinite(currentPrice) || currentPrice === 0) return 50;
  const ratio = Math.abs(slope) / currentPrice;
  return Math.max(50, Math.min(99, Math.round(50 + ratio * 5000)));
}

async function fetchCandles(symbol, interval, limit = 200) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Binance candles failed (${res.status})`);
  const data = await res.json();
  return data.map((k) => Number(k[4]));
}

app.post("/predict", async (req, res) => {
  try {
    const { symbol, interval = "1h" } = req.body || {};
    if (!symbol) return res.status(400).json({ error: "missing symbol" });
    const closes = await fetchCandles(symbol, interval, 200);
    const latest = closes.at(-1) ?? 0;
    const lr = linearRegressionForecast(closes, 30);
    const xover = movingAverageCrossoverSignal(closes, 9, 21);
    const rsis = rsi(closes, 14);
    const lastRsi = rsis.at(-1);

    let signal = xover;
    if (lastRsi != null) {
      if (lastRsi < 30) signal = "BUY";
      else if (lastRsi > 70) signal = "SELL";
    }

    const confidence = confidenceFromSlope(lr.slope, latest);
    const reason = [`LR forecast ${lr.nextPrice > latest ? "above" : "below"} spot`, `MA crossover: ${xover}`, `RSI14: ${lastRsi?.toFixed(2) ?? "n/a"}`].join(" · ");

    return res.json({ asset: symbol, signal, confidence, model: "Linear+MA+RSI v1", reason, time: new Date().toISOString() });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e?.message ?? String(e) });
  }
});

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Inference server listening on http://localhost:${port}`));
