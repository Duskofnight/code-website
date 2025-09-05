const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.static('public'));

// === GOOGLE OAuth CONFIG ===
const GOOGLE_CLIENT_ID = '389886161401-1aur1es2oj2s6n2p1lvgaulq9qjndhkj.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/auth/google/callback';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

// === GITHUB OAuth CONFIG ===
const GITHUB_CLIENT_ID = 'Ov23li7dyn39BF7m2p0f';
const GITHUB_CLIENT_SECRET = '2efceea7a530dac9838028bfde8a65f1a3ce78bb';

// === GOOGLE ROUTES ===
app.get('/auth/google', (req, res) => {
  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const {tokens} = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const user = response.data;
    res.cookie('user', JSON.stringify(user), { httpOnly: true });
    res.redirect('/onboard.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Google Authentication failed');
  }
});

// === GITHUB ROUTES ===
app.get('/auth/github', (req, res) => {
  const params = querystring.stringify({
    client_id: GITHUB_CLIENT_ID,
    scope: 'read:user user:email',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

app.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });

    const user = userRes.data;
    res.cookie('user', JSON.stringify(user), { httpOnly: true });
    res.redirect('/onboard.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('GitHub Authentication failed');
  }
});

// === COMMON ROUTES ===
app.get('/profile.html', (req, res) => {
  const userCookie = req.cookies.user;
  if (!userCookie) return res.redirect('/');

  const user = JSON.parse(userCookie);
  res.send(`
    <h1>Welcome ${user.name || user.login}</h1>
    <p>Email: ${user.email || 'No email public'}</p>
    <img src="${user.picture || user.avatar_url}" alt="profile photo"/>
    <br><a href="/">Logout</a>
  `);
});

app.get('/', (req, res) => {
  res.send(`
    <h1>OAuth Example</h1>
    <a href="/auth/google"><button>Login with Google</button></a><br><br>
    <a href="/auth/github"><button>Login with GitHub</button></a>
  `);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
