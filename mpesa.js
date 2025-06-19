require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  BUSINESS_SHORTCODE,
  PASSKEY,
  CALLBACK_URL
} = process.env;

const getAccessToken = async () => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` }
  });
  return response.data.access_token;
};

const lipaNaMpesaOnline = async (phone, amount) => {
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${BUSINESS_SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: BUSINESS_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: BUSINESS_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: CALLBACK_URL,
    AccountReference: "Test123",
    TransactionDesc: "Test payment"
  };

  const response = await axios.post(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};

// Endpoint to trigger STK push
app.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const result = await lipaNaMpesaOnline(phone, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Dummy callback handler
app.post('/callback', (req, res) => {
  console.log('M-Pesa Callback:', req.body);
  res.status(200).send('OK');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
