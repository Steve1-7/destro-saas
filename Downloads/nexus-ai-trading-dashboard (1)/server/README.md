Nexuss-AI Inference Service

Run a minimal Express server that computes AI signals from Binance candles.

Install and start:

```bash
cd server
npm install
npm start
```

Endpoint:
- `POST /predict` JSON { symbol: string, interval?: string } => returns predicted signal object

Note: This is a development scaffold. For production, add authentication, rate-limiting, caching, and deploy behind a secure gateway.
