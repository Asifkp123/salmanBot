import 'dotenv/config';
import Binance from 'binance-api-node';

export default async function handler(req, res) {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  const receivedSecret = req.headers['x-webhook-secret'];
  if (!webhookSecret || webhookSecret !== receivedSecret) {
    console.log('Expected secret:', webhookSecret);
    console.log('Received secret:', receivedSecret);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, symbol, quantity } = req.body;

  if (!action || !symbol || !quantity) {
    return res.status(400).json({ error: 'Missing required fields: action, symbol, or quantity' });
  }

  const apiKey = process.env.BINANCE_API_KEY;
  const apiSecret = process.env.BINANCE_API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: 'API keys missing' });
  }

  // Fix: Use Binance.default for ESM import
  const client = Binance.default({
    apiKey,
    apiSecret,
  });

  try {
    let order;
    if (action.toLowerCase() === 'buy') {
      order = await client.order({
        symbol,
        side: 'BUY',
        type: 'MARKET',
        quantity,
      });
    } else if (action.toLowerCase() === 'sell') {
      order = await client.order({
        symbol,
        side: 'SELL',
        type: 'MARKET',
        quantity,
      });
    } else {
      return res.status(400).json({ error: 'Invalid action: must be "buy" or "sell"' });
    }

    console.log('Order placed:', order);
    res.status(200).json({ status: 'success', order });
  } catch (err) {
    console.error('Order error:', err.body || err.message || err);
    res.status(500).json({ error: err.body || err.message || 'Failed to place order' });
  }
}