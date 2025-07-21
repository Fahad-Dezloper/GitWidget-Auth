const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.GITHUB_CLIENT_ID; // from GitHub OAuth app
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET; // from GitHub OAuth app

app.post('/api/github/exchange', async (req, res) => {
  const { code } = req.body;

  console.log("request happpen",  code)

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const { access_token } = response.data;

    console.log("access token here", access_token);

    if (!access_token) {
      return res.status(400).json({ error: 'No access token received', data: response.data });
    }

    return res.json({ token: access_token });
  } catch (err) {
    console.error('Error exchanging code:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to exchange token' });
  }
});

app.listen(4000, () => {
  console.log('✅ Backend ready at http://localhost:4000');
});
